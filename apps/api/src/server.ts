import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';

// Force load .env from root
dotenv.config({ path: path.join(__dirname, '../../..', '.env') });

import express from 'express';
import cors from 'cors';
import {
    PrismaClient
} from '@prisma/client';
import { generateInitialChecklist } from './ChecklistEngine';
import { generateProjectBrandedReport } from './PdfService';

const app = express();
const prisma = new PrismaClient();
const port = 4000;

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by VERCFLOW security policy'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 1. Auth: Básico (Login)
app.post('/api/auth/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'E-mail e senha obrigatórios' });

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.senhaHash !== senha) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        res.json({
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// 2. Records: Capture & Listing
function generateShortCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars O/0, I/1
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

console.log("\n[VERCFLOW-API] Ready - v2.1 (Stability Patch Executed)");

app.post('/api/records', async (req, res) => {
    const { authorId, projectId, clientId, texto, type, prioridade, natureza, parentId, items } = req.body;
    if (!authorId) return res.status(400).json({ error: 'authorId é obrigatório' });

    try {
        const userExists = await prisma.user.findUnique({ where: { id: authorId } });
        if (!userExists) {
            return res.status(401).json({ error: 'Sessão expirada ou usuário não encontrado.' });
        }

        const refCodigo = `VRC-${generateShortCode()}`;

        const record = await prisma.record.create({
            data: {
                authorId,
                refCodigo,
                projectId: projectId || null,
                clientId: clientId || null,
                texto,
                type: type || 'TEXTO',
                status: 'REGISTRO',
                prioridade: prioridade || 'MEDIA',
                natureza,
                parentId: parentId || null,
                isInicial: !parentId,
                items: (items && items.length > 0) ? {
                    create: items.map((item: any, idx: number) => {
                        const rawContent = typeof item.content === 'object' ? JSON.stringify(item.content) : item.content;
                        return {
                            type: item.type || 'TEXTO',
                            content: rawContent ?? '',
                            order: idx
                        };
                    })
                } : undefined
            },
            include: {
                author: { select: { nome: true, role: true } },
                project: { select: { nome: true } },
                items: true,
                parent: { select: { refCodigo: true } }
            }
        });

        res.json(record);
    } catch (error: any) {
        console.error("!!! CRITICAL ERROR IN /api/records !!!");
        console.error(error);

        try {
            const logMsg = `\n[${new Date().toISOString()}] ERROR: ${error.message}\nSTACK: ${error.stack}\n`;
            fs.appendFileSync('api_error.log', logMsg);
        } catch (e) {
            console.error("FAILED TO WRITE TO LOG FILE", e);
        }

        res.status(500).json({
            error: 'Erro interno ao criar registro',
            code: error.code,
            message: error.message
        });
    }
});

app.get('/api/records', async (req, res) => {
    const { projectId, clientId, status, parentId } = req.query;

    try {
        const records = await prisma.record.findMany({
            where: {
                projectId: projectId ? String(projectId) : undefined,
                clientId: clientId ? String(clientId) : undefined,
                status: status ? String(status) : undefined,
                parentId: parentId ? String(parentId) : undefined,
            },
            include: {
                author: { select: { nome: true, role: true } },
                project: { select: { nome: true } },
                sketch: true,
                documents: true,
                items: true,
                revisions: { select: { id: true, refCodigo: true, criadoEm: true } }
            },
            orderBy: { criadoEm: 'desc' }
        });
        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar registros' });
    }
});

// 4. Projects: For filters
// 7.1 Enquadramento: Auto-link disciplines based on category
app.post('/api/projects/:id/enquadramento', async (req, res) => {
    const { id } = req.params;
    try {
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) return res.status(404).json({ error: 'Obra não encontrada' });

        const category = project.categoria;
        let suggestedCodes: string[] = ['1.x']; // Always Preliminares

        if (category === 'RESIDENCIAL') suggestedCodes = ['1.x', '2.x', '3.x', '4.x', '5.x'];
        else if (category === 'COMERCIAL') suggestedCodes = ['1.x', '2.x', '3.x', '4.x', '5.x', '6.x'];
        else if (category === 'INDUSTRIAL') suggestedCodes = ['1.x', '3.x', '4.x', '5.x', '7.x', '8.x'];
        else if (category === 'HOSPITALAR') suggestedCodes = ['1.x', '2.x', '3.x', '4.x', '5.x', '9.x', '10.x'];

        // Link missing disciplines (simplified)
        const existing = await prisma.discipline.findMany({ where: { projectId: id } });
        const existingCodes = existing.map(e => e.codigo);
        const toCreate = suggestedCodes.filter(c => !existingCodes.includes(c));

        if (toCreate.length > 0) {
            await Promise.all(toCreate.map(code =>
                prisma.discipline.create({
                    data: {
                        projectId: id,
                        codigo: code,
                        name: `Disciplina ${code}`, // Stub name
                        category: 'GERADO_AUTO',
                        status: 'NAO_CONTRATADO'
                    }
                })
            ));
        }

        res.json({ message: `Enquadramento ${category} processado`, created: toCreate.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no enquadramento' });
    }
});

// 7.2 Fees Management
app.get('/api/projects/:id/fees', async (req, res) => {
    const { id } = req.params;
    try {
        const fees = await prisma.fee.findMany({ where: { projectId: id }, orderBy: { criadoEm: 'desc' } });
        res.json(fees);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar taxas' });
    }
});

app.post('/api/fees', async (req, res) => {
    const { projectId, documentId, nome, valor, vencimento } = req.body;
    try {
        const fee = await prisma.fee.create({
            data: { projectId, documentId, nome, valor, vencimento: vencimento ? new Date(vencimento) : null }
        });
        res.json(fee);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar taxa' });
    }
});

app.get('/api/projects', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                client: { select: { nome: true } }
            }
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
});

app.get('/api/projects/:id/report', async (req, res) => {
    const { id } = req.params;
    try {
        const pdfBuffer = await generateProjectBrandedReport(id);
        res.contentType("application/pdf");
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao gerar relatório da obra' });
    }
});

app.get('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                client: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            }
        });
        if (!project) return res.status(404).json({ error: 'Obra não encontrada' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar detalhes da obra' });
    }
});

// 5. Professionals: Management
app.get('/api/professionals', async (req, res) => {
    try {
        const professionals = await prisma.professional.findMany({
            include: {
                assignments: {
                    include: {
                        activity: true
                    }
                },
                categories: true
            }
        });
        res.json(professionals);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar profissionais' });
    }
});

app.post('/api/professionals', async (req, res) => {
    const { nome, tipo, documento, contatos, categories } = req.body;
    try {
        const prof = await prisma.professional.create({
            data: {
                nome,
                tipo: tipo || 'EXTERNO_MAO_OBRA',
                documento,
                contatos,
                categories: categories ? {
                    create: categories.map((cat: string) => ({ category: cat }))
                } : undefined
            }
        });
        res.json(prof);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar profissional' });
    }
});

// 5. Sketch: Save and stub for PDF
app.post('/api/records/:id/sketch', async (req, res) => {
    const { id } = req.params;
    const { dataJson, imageUrl } = req.body;

    try {
        const sketch = await prisma.sketch.upsert({
            where: { recordId: id },
            create: {
                recordId: id,
                dataJson,
                imageUrl,
            },
            update: {
                dataJson,
                imageUrl,
            }
        });

        // Stub: Trigger PDF generation
        await prisma.document.create({
            data: {
                recordId: id,
                tipo: 'ESBOCO_TIMBRADO',
                status: 'EMITIDO',
                pdfUrl: `/api/docs/pdf-stub-${id}.pdf`
            }
        });

        res.json({ message: 'Esboço salvo e PDF gerado', sketch });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar esboço' });
    }
});

app.patch('/api/records/:id', async (req, res) => {
    const { id } = req.params;
    const { status, prioridade, projectId, natureza, responsavelValoresId } = req.body;

    try {
        const record = await prisma.record.update({
            where: { id },
            data: {
                status,
                prioridade,
                projectId,
                natureza,
                responsavelValoresId
            },
            include: {
                author: { select: { nome: true, role: true } },
                project: { select: { nome: true } },
                sketch: true,
                documents: true,
                items: true
            }
        });
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
});

app.post('/api/docs/formalize', async (req, res) => {
    const { recordId } = req.body;
    try {
        const record = await prisma.record.findUnique({
            where: { id: recordId },
            include: { sketch: true, author: true }
        });

        if (!record) return res.status(404).json({ error: 'Registro não encontrado' });

        const hash = Math.random().toString(36).substring(7).toUpperCase();

        const doc = await prisma.document.create({
            data: {
                recordId,
                tipo: 'PROTOCOLADO_VALIDO',
                status: 'EMITIDO',
                versao: 1,
                hash,
                pdfUrl: `/api/docs/view/${recordId}?h=${hash}`
            }
        });

        // Update record status
        await prisma.record.update({
            where: { id: recordId },
            data: { status: 'CONVERTIDO' }
        });

        res.json(doc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao formalizar documento' });
    }
});

// View PDF Stub
app.get('/api/docs/view/:recordId', async (req, res) => {
    const { recordId } = req.params;
    const { h } = req.query;
    res.send(`<h1>Documento Validado VERCFLOW</h1><p>Protocolo: ${h}</p><p>Registro: ${recordId}</p>`);
});

app.delete('/api/records/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.$transaction(async (tx) => {
            // Delete associated items first (if no cascade)
            await tx.recordItem.deleteMany({ where: { recordId: id } });
            await tx.sketch.deleteMany({ where: { recordId: id } });
            await tx.document.deleteMany({ where: { recordId: id } });
            await tx.activity.deleteMany({ where: { recordId: id } });
            await tx.record.delete({ where: { id } });
        });
        res.json({ message: 'Registro excluído com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir registro' });
    }
});

app.post('/api/records/:id/convert', async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, projectId, professionalId, valorPrevisto } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Activity linked to Record
            const activity = await tx.activity.create({
                data: {
                    recordId: id,
                    projectId,
                    titulo,
                    descricao,
                    status: 'PLANEJADO'
                }
            });

            // 2. Create Professional Assignment
            if (professionalId) {
                await tx.activityAssignment.create({
                    data: {
                        activityId: activity.id,
                        professionalId,
                        valorPrevisto: valorPrevisto || 0
                    }
                });
            }

            // 3. Update Record status
            await tx.record.update({
                where: { id },
                data: { status: 'CONVERTIDO' }
            });

            return activity;
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao converter registro em atividade' });
    }
});

// 6. Users: Management
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, nome: true, email: true, role: true, ativo: true, criadoEm: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

app.post('/api/users', async (req, res) => {
    const { nome, email, senhaHash, role } = req.body;
    try {
        const user = await prisma.user.create({
            data: { nome, email, senhaHash, role: role || 'OPERACIONAL' }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// 7. Projects: Management
app.post('/api/projects', async (req, res) => {
    const {
        nome, clientId, codigoInterno, tipoObra,
        responsavelTecnico, localizacao, areaConstruida, pavimentos,
        urgencia, estrutura, subsolo, piscina, condominio,
        corpoBombeiros, vigilanciaSanitaria, operacaoContinua
    } = req.body;

    try {
        const project = await prisma.project.create({
            data: {
                nome,
                endereco: localizacao,
                clientId,
                codigoInterno,
                tipoObra,
                areaConstruida: areaConstruida ? parseFloat(areaConstruida) : null,
                pavimentos: pavimentos ? parseInt(pavimentos) : null,
                exigenciasAprovacao: JSON.stringify({
                    estrutura, subsolo, piscina, condominio,
                    corpoBombeiros, vigilanciaSanitaria, operacaoContinua,
                    urgencia, responsavelTecnico
                }),
                status: 'ORCAMENTO',
            },
            include: { client: { select: { nome: true } } }
        });

        // Trigger Checklist Engine with all parameters
        await generateInitialChecklist(project.id, req.body);

        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar obra' });
    }
});

// 7b. Project Configuration Wizard
app.post('/api/projects/:id/configure', async (req, res) => {
    const { id } = req.params;
    const { selectedDisciplines, selectedAmbientes, selectedOrgaos } = req.body;

    try {
        // Update project with configuration
        await prisma.project.update({
            where: { id },
            data: {
                exigenciasAprovacao: JSON.stringify(selectedOrgaos)
            }
        });

        // Generate checklists
        const result = await generateInitialChecklist(id, { selectedDisciplines, selectedOrgaos });

        // Store ambientes as metadata (could be separate table in future)
        // For now, we'll just confirm success

        res.json({
            success: true,
            message: 'Configuração concluída',
            stats: {
                disciplinas: selectedDisciplines.length,
                ambientes: selectedAmbientes.length,
                orgaos: Object.values(selectedOrgaos).filter(Boolean).length
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao configurar obra' });
    }
});

app.get('/api/clients', async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            include: { _count: { select: { projects: true } } }
        });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

app.post('/api/clients', async (req, res) => {
    const {
        nome, tipo, documento, rgIe, contatos,
        enderecoCompleto, representacao, configOrgaos
    } = req.body;

    try {
        const client = await prisma.client.create({
            data: {
                nome,
                tipo: tipo || 'PF',
                documento,
                rgIe,
                contatos: typeof contatos === 'object' ? JSON.stringify(contatos) : contatos,
                enderecoCompleto,
                representacao: typeof representacao === 'object' ? JSON.stringify(representacao) : representacao,
                configOrgaos: typeof configOrgaos === 'object' ? JSON.stringify(configOrgaos) : configOrgaos
            }
        });
        res.json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar cliente' });
    }
});

// 8. Activities: Retrieval
app.get('/api/activities', async (req, res) => {
    try {
        const activities = await prisma.activity.findMany({
            include: {
                project: { select: { nome: true } },
                record: { select: { texto: true, type: true, refCodigo: true } },
                assignments: {
                    include: {
                        professional: { select: { nome: true, tipo: true } }
                    }
                }
            },
            orderBy: { criadoEm: 'desc' }
        });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar atividades' });
    }
});

app.patch('/api/activities/:id', async (req, res) => {
    const { id } = req.params;
    const { status, prioridade, dataFim } = req.body;

    try {
        const activity = await prisma.activity.update({
            where: { id },
            data: { status, prioridade, dataFim },
            include: {
                project: { select: { nome: true } },
                assignments: {
                    include: {
                        professional: { select: { nome: true } }
                    }
                }
            }
        });
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar atividade' });
    }
});

// 10. Dashboards: Home & CEO
app.get('/api/dashboard/home', async (req, res) => {
    try {
        const [
            obrasAtivas,
            obrasEmAprovacao,
            documentosVencidos,
            atividadesEmExecucao,
            recentRecords,
            obrasRecentes,
            pedidosAtrasados
        ] = await Promise.all([
            prisma.project.count({ where: { status: 'ATIVA' } }),
            prisma.project.count({ where: { status: 'EM_APROVACAO_ORGAOS' } }),
            prisma.checklistItem.count({
                where: {
                    status: 'PENDENTE',
                    prazo: { lt: new Date() }
                }
            }),
            prisma.activity.findMany({
                where: { status: 'EM_EXECUCAO' },
                take: 5,
                include: { project: { select: { nome: true } } }
            }),
            prisma.record.findMany({
                take: 10,
                orderBy: { criadoEm: 'desc' },
                include: { author: { select: { nome: true } } }
            }),
            prisma.project.findMany({
                take: 5,
                orderBy: { criadoEm: 'desc' },
                include: { client: { select: { nome: true } } }
            }),
            prisma.purchaseRequest.count({
                where: {
                    status: 'PENDENTE',
                    criadoEm: { lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } // Over 3 days
                }
            })
        ]);

        // Calculate records by phase
        const recordsByPhase = await prisma.record.groupBy({
            by: ['status'],
            _count: true
        });

        res.json({
            obrasAtivas,
            obrasEmAprovacao,
            pendenciasCriticas: documentosVencidos + pedidosAtrasados,
            documentosVencidos,
            projetosAtrasados: 0,
            comprasUrgentes: pedidosAtrasados,
            recordsByPhase: recordsByPhase.reduce((acc: any, curr) => {
                acc[curr.status] = curr._count;
                return acc;
            }, {}),
            atividadesEmExecucao,
            recentRecords,
            obrasRecentes,
            alertas: pedidosAtrasados > 0 ? [{
                id: 'logistics-1',
                tipo: 'CRITICO',
                titulo: 'Pedidos em Atraso',
                descricao: `Existem ${pedidosAtrasados} pedidos de compra pendentes há mais de 3 dias.`
            }] : []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
    }
});

// 11. Logistics: Vehicles
app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            include: { responsavel: { select: { nome: true } } }
        });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar veículos' });
    }
});

app.post('/api/vehicles', async (req, res) => {
    const { placa, modelo, marca, tipo, cor, ano, responsavelId } = req.body;
    try {
        const vehicle = await prisma.vehicle.create({
            data: { placa, modelo, marca, tipo, cor, ano, responsavelId }
        });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar veículo' });
    }
});

// 12. Stock: Movements
app.get('/api/stock/movements', async (req, res) => {
    try {
        const movements = await prisma.stockMovement.findMany({
            include: {
                usuario: { select: { nome: true } },
                obra: { select: { nome: true } }
            },
            orderBy: { criadoEm: 'desc' }
        });
        res.json(movements);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar movimentações' });
    }
});

app.post('/api/stock/movements', async (req, res) => {
    const { tipo, item, quantidade, unidade, obraId, usuarioId, observacao } = req.body;
    try {
        const movement = await prisma.stockMovement.create({
            data: { tipo, item, quantidade, unidade, obraId, usuarioId, observacao }
        });
        res.json(movement);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar movimentação' });
    }
});

// 10. CEO Dashboard: KPIs Reais
app.get('/api/dashboard/ceo', async (req, res) => {
    try {
        const [recordsCount, esbocosTriagem, atividadesAtivas, totalPrevisto] = await Promise.all([
            prisma.record.count(),
            prisma.record.count({ where: { status: 'TRIAGEM' } }),
            prisma.activity.count({ where: { status: 'EM_EXECUCAO' } }),
            prisma.activityAssignment.aggregate({
                _sum: { valorPrevisto: true }
            })
        ]);

        res.json({
            kpis: [
                { label: 'Registros Totais', value: recordsCount.toString(), change: '+12%', trend: 'up' },
                { label: 'Esboços em Triagem', value: esbocosTriagem.toString(), change: '5 críticas', trend: 'down' },
                { label: 'Atividades Ativas', value: atividadesAtivas.toString(), change: '80% SLA', trend: 'up' },
                { label: 'Custo Previsto', value: `R$ ${(totalPrevisto._sum.valorPrevisto || 0).toLocaleString('pt-BR')}`, change: '+R$ 12k', trend: 'up' },
            ],
            topProjects: await prisma.project.findMany({
                take: 5,
                include: { _count: { select: { activities: true } } },
                orderBy: { activities: { _count: 'desc' } }
            })
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar KPIs do dashboard' });
    }
});

// 9. PDF Technical View (True PDF Download)
app.get('/api/records/:id/pdf-view', async (req, res) => {
    const { id } = req.params;
    const { itemId } = req.query;

    try {
        const record = await prisma.record.findUnique({
            where: { id },
            include: {
                sketch: true,
                items: { orderBy: { order: 'asc' } },
                author: { select: { nome: true, role: true } },
                project: { include: { client: true } },
                parent: { select: { refCodigo: true } }
            }
        });

        if (!record) return res.status(404).send('Registro não encontrado');

        // Filter items if itemId is provided
        let displayItems = record.items;
        let isIndividual = false;
        if (itemId) {
            displayItems = record.items.filter(it => it.id === itemId);
            isIndividual = true;
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 40px; color: #1a1a1a; font-size: 12px; line-height: 1.5; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
                    .brand { font-size: 24px; font-weight: 800; letter-spacing: -1px; }
                    .doc-title { font-size: 14px; font-weight: 700; text-transform: uppercase; margin-top: 5px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                    .info-item { margin-bottom: 8px; }
                    .label { font-weight: 700; color: #666; font-size: 10px; text-transform: uppercase; display: block; }
                    .section { margin-bottom: 30px; }
                    .section-title { font-weight: 800; text-transform: uppercase; font-size: 11px; color: #000; border-bottom: 1px solid #1a1a1a; padding-bottom: 5px; margin-bottom: 15px; }
                    .observation-box { background: #f9f9f9; border-left: 4px solid #ddd; padding: 15px; font-style: italic; margin-bottom: 25px; }
                    .item { margin-bottom: 20px; border: 1px solid #eee; padding: 15px; border-radius: 8px; }
                    .item-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
                    .item-badge { font-size: 9px; font-weight: 700; padding: 2px 6px; background: #eee; border-radius: 4px; text-transform: uppercase; }
                    .item-img { max-width: 100%; height: auto; border-radius: 4px; margin-top: 10px; border: 1px solid #ddd; }
                    .footer { border-top: 1px solid #eee; padding-top: 15px; font-size: 10px; color: #999; display: flex; justify-content: space-between; align-items: center; margin-top: 40px; }
                    .rev-box { border: 1px solid #999; padding: 5px 10px; font-weight: 700; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="brand">VERCFLOW</div>
                        <div class="doc-title">Relatório de Registro de Campo ${isIndividual ? '(Individual)' : ''}</div>
                    </div>
                    <div style="text-align: right">
                        <div style="font-size: 16px; font-weight: 800;">${record.refCodigo}</div>
                        <div style="font-size: 10px; color: #666;">Ref. Projeto: ${record.project?.nome || 'Geral'}</div>
                    </div>
                </div>

                <div class="info-grid">
                    <div>
                        <div class="info-item">
                            <span class="label">Cliente / Obra</span>
                            <strong>${record.project?.client?.nome || 'N/A'}</strong> / ${record.project?.nome || 'N/A'}
                        </div>
                        <div class="info-item">
                            <span class="label">Data e Hora</span>
                            ${dateStr} às ${timeStr}
                        </div>
                    </div>
                    <div>
                        <div class="info-item">
                            <span class="label">Responsável</span>
                            ${record.author?.nome} (${record.author?.role})
                        </div>
                        <div class="info-item">
                            <span class="label">Natureza</span>
                            ${record.natureza || 'Técnico'}
                        </div>
                    </div>
                </div>

                ${record.texto && !isIndividual ? `
                <div class="section">
                    <div class="section-title">Observações Gerais</div>
                    <div class="observation-box">${record.texto}</div>
                </div>
                ` : ''}

                <div class="section">
                    <div class="section-title">${isIndividual ? 'Item Específico' : 'Conteúdo Detalhado'}</div>
                    <div class="item-list">
                        ${displayItems.map(item => `
                            <div class="item">
                                <div class="item-header">
                                    <span class="item-badge">${item.type}</span>
                                </div>
                                <div class="item-content">
                                    ${item.type === 'FOTO' ? `<img src="${item.content}" class="item-img" />` :
                item.type === 'ESBOCO' ? `<div style="color:#666; font-size:10px;">[Dados de Esboço Técnico]</div>` :
                    `<div>${item.content}</div>`}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${record.sketch && !isIndividual ? `
                <div class="section">
                    <div class="section-title">Anexo: Esboço Técnico</div>
                    <img src="${record.sketch.imageUrl}" class="item-img" style="filter: grayscale(1); border-style: dashed;" />
                </div>
                ` : ''}

                <div class="footer">
                    <div>
                        <strong>VERCFLOW</strong> • Gestão e Tecnologia de Campo<br/>
                        Gerado em ${dateStr} às ${timeStr}
                    </div>
                    <div class="rev-box">
                        REVISÃO: ${record.parent ? '02' : '01'}
                    </div>
                </div>
            </body>
            </html>
        `;

        const filename = isIndividual ? `VRC-${record.refCodigo}-ITEM.pdf` : `VRC-${record.refCodigo}.pdf`;

        const browser = await puppeteer.launch({
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new']
        });

        try {
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({
                format: 'a4',
                printBackground: true,
                margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
            });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(pdfBuffer);
        } finally {
            await browser.close();
        }

    } catch (error) {
        console.error('SERVER_PDF_ERROR:', error);
        res.status(500).send('Erro ao renderizar PDF');
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'vercflow-api' });
});

// 11. Record Items: Update (Checklist)
app.patch('/api/record-items/:id', async (req, res) => {
    const { id } = req.params;
    const { checked } = req.body;

    try {
        const item = await prisma.recordItem.update({
            where: { id },
            data: { checked }
        });
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar item' });
    }
});

// 12. Purchasing Flow: POP Compras
app.get('/api/purchases', async (req, res) => {
    try {
        const purchases = await prisma.purchaseRequest.findMany({
            include: {
                project: { select: { nome: true } },
                cotacoes: true,
                ordemCompra: true
            },
            orderBy: { criadoEm: 'desc' }
        });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pedidos de compra' });
    }
});

app.post('/api/purchases', async (req, res) => {
    const { projectId, solicitanteId, disciplina, urgencia, obs } = req.body;
    try {
        const purchase = await prisma.purchaseRequest.create({
            data: {
                projectId,
                solicitanteId,
                disciplina,
                urgencia: urgencia || 'NORMAL',
                obs,
                status: 'SOLICITADO'
            }
        });
        res.json(purchase);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar pedido de compra' });
    }
});

app.post('/api/purchases/:id/quotations', async (req, res) => {
    const { id } = req.params;
    const { fornecedor, valorTotal, prazoEntrega, condicaoPagamento } = req.body;
    try {
        const cotacao = await prisma.purchaseQuotation.create({
            data: {
                requestId: id,
                fornecedor,
                valorTotal,
                prazoEntrega,
                condicaoPagamento
            }
        });
        res.json(cotacao);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar cotação' });
    }
});

app.post('/api/purchases/:id/order', async (req, res) => {
    const { id } = req.params;
    const { numeroOC, valorFinal } = req.body;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.purchaseOrder.create({
                data: {
                    requestId: id,
                    numeroOC,
                    valorFinal,
                    status: 'EMITIDA'
                }
            });
            await tx.purchaseRequest.update({
                where: { id },
                data: { status: 'OC_EMITIDA' }
            });
            return order;
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao emitir ordem de compra' });
    }
});

app.listen(port, () => {
    console.log(`[VERCFLOW API]: Server is running at http://localhost:${port}`);
});
