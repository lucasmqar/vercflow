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
                status: 'CAPTURE',
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
        const { status, tipo, clientId, responsavelId } = req.query;

        const where: any = {};
        if (status) where.status = status as string;
        if (tipo) where.tipoObra = tipo as string;
        if (clientId) where.clientId = clientId as string;
        if (responsavelId) {
            where.OR = [
                { mestreObraId: responsavelId as string },
                { engenheiroId: responsavelId as string }
            ];
        }

        const projects = await prisma.project.findMany({
            where,
            include: {
                client: { select: { nome: true } },
                mestreObra: { select: { nome: true } },
                engenheiroResponsavel: { select: { nome: true } },
                _count: { select: { activities: true, disciplines: true } }
            },
            orderBy: { updatedAt: 'desc' }
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
        const { role, userId } = req.query;
        const userRole = role as string || 'OPERACIONAL';

        // Core metrics (all roles)
        const [
            obrasAtivas,
            obrasEmAprovacao,
            documentosVencidos,
            atividadesEmExecucao,
            recentRecords,
            obrasRecentes,
            pedidosAtrasados,
            totalInvestment,
            teamCount,
            tasksCompleted,
            tasksTotal
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
                include: {
                    project: { select: { nome: true } },
                    assignments: {
                        include: {
                            professional: { select: { nome: true } }
                        }
                    }
                }
            }),
            prisma.record.findMany({
                take: 10,
                orderBy: { criadoEm: 'desc' },
                include: {
                    author: { select: { nome: true } },
                    project: { select: { nome: true } }
                }
            }),
            prisma.project.findMany({
                take: 5,
                orderBy: { updatedAt: 'desc' },
                where: { status: { in: ['ATIVA', 'FECHADA'] } },
                include: {
                    client: { select: { nome: true } },
                    _count: { select: { activities: true } }
                }
            }),
            prisma.purchaseRequest.count({
                where: {
                    status: { in: ['SOLICITADO', 'EM_COTACAO'] },
                    criadoEm: { lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
                }
            }),
            prisma.activityAssignment.aggregate({
                _sum: { valorPrevisto: true, valorReal: true }
            }),
            prisma.user.count({ where: { ativo: true } }),
            prisma.activity.count({ where: { status: 'CONCLUIDO' } }),
            prisma.activity.count()
        ]);

        // Timeline events (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const timelineEvents = await prisma.record.findMany({
            where: { criadoEm: { gte: sevenDaysAgo } },
            take: 20,
            orderBy: { criadoEm: 'desc' },
            include: {
                author: { select: { nome: true } },
                project: { select: { nome: true } }
            }
        });

        // Role-specific KPIs
        let primaryKPIs: any = {};

        if (userRole === 'CEO') {
            const margin = ((totalInvestment._sum.valorPrevisto || 0) - (totalInvestment._sum.valorReal || 0)) /
                (totalInvestment._sum.valorPrevisto || 1) * 100;

            primaryKPIs = {
                investimentoTotal: {
                    label: 'Investimento Total',
                    value: `R$ ${(totalInvestment._sum.valorPrevisto || 0).toLocaleString('pt-BR')}`,
                    change: '+12%',
                    trend: 'up',
                    color: 'blue'
                },
                margemLucro: {
                    label: 'Margem de Lucro',
                    value: `${margin.toFixed(1)}%`,
                    change: '+3.2%',
                    trend: 'up',
                    color: 'green'
                },
                obrasAtivas: {
                    label: 'Obras Ativas',
                    value: obrasAtivas.toString(),
                    change: '100% operacionais',
                    trend: 'neutral',
                    color: 'purple'
                },
                satisfacaoCliente: {
                    label: 'Satisfação Cliente',
                    value: '4.8/5.0',
                    change: '+0.2 vs mês',
                    trend: 'up',
                    color: 'orange'
                }
            };
        } else if (userRole === 'GESTOR') {
            const budgetUtilization = ((totalInvestment._sum.valorReal || 0) / (totalInvestment._sum.valorPrevisto || 1)) * 100;

            primaryKPIs = {
                obrasAtivas: {
                    label: 'Obras Ativas',
                    value: obrasAtivas.toString(),
                    change: `${obrasEmAprovacao} em aprovação`,
                    trend: 'neutral',
                    color: 'blue'
                },
                tarefasPendentes: {
                    label: 'Tarefas Pendentes',
                    value: (tasksTotal - tasksCompleted).toString(),
                    change: `${Math.round((tasksCompleted / tasksTotal) * 100)}% concluídas`,
                    trend: 'up',
                    color: 'orange'
                },
                equipeAlocada: {
                    label: 'Equipe Alocada',
                    value: teamCount.toString(),
                    change: `${atividadesEmExecucao.length} ativ. ativas`,
                    trend: 'neutral',
                    color: 'purple'
                },
                budgetUtilizado: {
                    label: 'Budget Utilizado',
                    value: `${budgetUtilization.toFixed(0)}%`,
                    change: `R$ ${(totalInvestment._sum.valorReal || 0).toLocaleString('pt-BR')}`,
                    trend: budgetUtilization > 90 ? 'down' : 'up',
                    color: budgetUtilization > 90 ? 'red' : 'green'
                }
            };
        } else {
            // OPERACIONAL / default
            const myTasks = userId ? await prisma.activity.count({
                where: {
                    assignments: {
                        some: { professional: { userId: userId as string } }
                    },
                    status: { in: ['PLANEJADO', 'EM_EXECUCAO'] }
                }
            }) : 0;

            primaryKPIs = {
                minhasTarefas: {
                    label: 'Minhas Tarefas',
                    value: myTasks.toString(),
                    change: '3 para hoje',
                    trend: 'neutral',
                    color: 'blue'
                },
                registrosHoje: {
                    label: 'Registros Hoje',
                    value: recentRecords.filter(r => {
                        const today = new Date();
                        const created = new Date(r.criadoEm);
                        return created.toDateString() === today.toDateString();
                    }).length.toString(),
                    change: `${recentRecords.length} esta semana`,
                    trend: 'up',
                    color: 'green'
                },
                documentosPendentes: {
                    label: 'Docs Pendentes',
                    value: documentosVencidos.toString(),
                    change: documentosVencidos > 5 ? 'Atenção' : 'Em dia',
                    trend: documentosVencidos > 5 ? 'down' : 'up',
                    color: documentosVencidos > 5 ? 'red' : 'orange'
                },
                horasTrabalhadas: {
                    label: 'Horas (Mês)',
                    value: '142h',
                    change: '85% meta',
                    trend: 'up',
                    color: 'purple'
                }
            };
        }

        // Quick Stats (6 mini cards)
        const quickStats = {
            documentosGerados: await prisma.document.count({
                where: {
                    criadoEm: { gte: new Date(new Date().setDate(1)) } // This month
                }
            }),
            comprasUrgentes: pedidosAtrasados,
            pendenciasCriticas: documentosVencidos,
            eficienciaEquipe: Math.round((tasksCompleted / tasksTotal) * 100),
            slaCompliance: 96,
            budgetUtilizado: Math.round(((totalInvestment._sum.valorReal || 0) / (totalInvestment._sum.valorPrevisto || 1)) * 100)
        };

        // Critical Alerts
        const alertas: any[] = [];
        if (pedidosAtrasados > 0) {
            alertas.push({
                id: 'purchase-delay',
                tipo: 'URGENTE',
                titulo: 'Pedidos de Compra Atrasados',
                descricao: `${pedidosAtrasados} pedidos pendentes há mais de 3 dias.`,
                action: 'estoque'
            });
        }
        if (documentosVencidos > 5) {
            alertas.push({
                id: 'docs-overdue',
                tipo: 'CRITICO',
                titulo: 'Documentos Vencidos',
                descricao: `${documentosVencidos} itens de checklist com prazo vencido.`,
                action: 'gestao-projetos'
            });
        }

        res.json({
            // Legacy support
            obrasAtivas,
            obrasEmAprovacao,
            documentosVencidos,
            pendenciasCriticas: documentosVencidos + pedidosAtrasados,
            projetosAtrasados: 0,
            comprasUrgentes: pedidosAtrasados,
            atividadesEmExecucao,
            recentRecords,
            obrasRecentes,

            // New dashboard data
            userRole,
            primaryKPIs,
            quickStats,
            timelineEvents: timelineEvents.map(event => ({
                id: event.id,
                date: event.criadoEm,
                type: event.type,
                title: event.texto?.substring(0, 60) || 'Registro de campo',
                user: event.author.nome,
                project: event.project?.nome || 'Geral'
            })),
            alertas: alertas.slice(0, 3), // Max 3 alerts
            finansialStats: {
                totalInvestment: totalInvestment._sum.valorPrevisto || 0,
                totalSpent: totalInvestment._sum.valorReal || 0,
                budgetRemaining: (totalInvestment._sum.valorPrevisto || 0) - (totalInvestment._sum.valorReal || 0)
            }
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

// Engineering Dashboard: Pipeline (Orçamentos)
app.get('/api/projects/pipeline', async (req, res) => {
    try {
        const [orcamentos, totalValor, taxaConversao] = await Promise.all([
            prisma.project.findMany({
                where: { status: { in: ['ORCAMENTO', 'NEGOCIACAO'] } },
                include: {
                    client: { select: { nome: true } },
                    mestreObra: { select: { nome: true } },
                    _count: { select: { activities: true } }
                },
                orderBy: { criadoEm: 'desc' }
            }),
            prisma.activityAssignment.aggregate({
                where: {
                    activity: {
                        project: { status: { in: ['ORCAMENTO', 'NEGOCIACAO'] } }
                    }
                },
                _sum: { valorPrevisto: true }
            }),
            prisma.project.count({ where: { status: 'FECHADA' } })
        ]);

        const totalOrcamentos = orcamentos.length;
        const totalProjetos = await prisma.project.count();

        res.json({
            orcamentos,
            metricas: {
                totalAtivos: totalOrcamentos,
                valorEstimado: totalValor._sum.valorPrevisto || 0,
                taxaConversao: totalProjetos > 0 ? Math.round((taxaConversao / totalProjetos) * 100) : 0
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar pipeline de orçamentos' });
    }
});

// Engineering Dashboard: Completed Projects
app.get('/api/projects/completed', async (req, res) => {
    try {
        const completed = await prisma.project.findMany({
            where: { status: { in: ['CONCLUIDA', 'CANCELADA'] } },
            include: {
                client: { select: { nome: true } },
                mestreObra: { select: { nome: true } },
                engenheiroResponsavel: { select: { nome: true } },
                _count: { select: { activities: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json(completed.map((p: any) => ({
            ...p,
            statistics: {
                totalDocs: 0, // Would need Document model relation
                totalFees: 0, // Would need Fee aggregation
                prazoReal: 'N/A',
                budgetFinal: 0
            }
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar obras concluídas' });
    }
});

// Project Schedule/Timeline
app.get('/api/projects/:id/schedule', async (req, res) => {
    const { id } = req.params;
    try {
        const [project, disciplines, activities] = await Promise.all([
            prisma.project.findUnique({ where: { id } }),
            prisma.discipline.findMany({
                where: { projectId: id },
                include: { responsible: { select: { nome: true } } }
            }),
            prisma.activity.findMany({
                where: { projectId: id },
                include: {
                    assignments: {
                        include: { professional: { select: { nome: true } } }
                    }
                },
                orderBy: { dataInicio: 'asc' }
            })
        ]);

        // Generate mock timeline phases (in real app, derive from activities)
        const phases = [
            { id: 'fundacao', nome: 'Fundação', inicio: new Date(), fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), progresso: 100, responsavel: 'João Silva' },
            { id: 'estrutura', nome: 'Estrutura', inicio: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), fim: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), progresso: 60, responsavel: 'Maria Santos' },
            { id: 'alvenaria', nome: 'Alvenaria', inicio: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), fim: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), progresso: 30, responsavel: 'Pedro Costa' },
            { id: 'instalacoes', nome: 'Instalações', inicio: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), fim: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000), progresso: 0, responsavel: null },
            { id: 'acabamento', nome: 'Acabamento', inicio: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000), fim: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), progresso: 0, responsavel: null }
        ];

        res.json({
            project,
            phases,
            milestones: [
                { id: 'm1', titulo: 'Aprovação de Projeto', data: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), concluido: false },
                { id: 'm2', titulo: 'Estrutura Concluída', data: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), concluido: false },
                { id: 'm3', titulo: 'Instalações Finalizadas', data: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000), concluido: false }
            ],
            disciplines,
            activities
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar cronograma' });
    }
});

// Project Professionals Management
app.get('/api/projects/:id/professionals', async (req, res) => {
    const { id } = req.params;
    try {
        const assignments = await prisma.activityAssignment.findMany({
            where: {
                activity: { projectId: id }
            },
            include: {
                professional: {
                    include: {
                        user: { select: { nome: true } },
                        categories: true
                    }
                },
                activity: { select: { titulo: true, status: true } }
            }
        });

        // Group by professional
        const professionalsMap = new Map();
        assignments.forEach((assignment: any) => {
            const profId = assignment.professional.id;
            if (!professionalsMap.has(profId)) {
                professionalsMap.set(profId, {
                    ...assignment.professional,
                    horasAlocadas: 0,
                    custoPrevisto: 0,
                    custoRealizado: 0,
                    atividades: []
                });
            }
            const prof = professionalsMap.get(profId);
            prof.horasAlocadas += 8; // Mock hours
            prof.custoPrevisto += assignment.valorPrevisto;
            prof.custoRealizado += assignment.valorReal || 0;
            prof.atividades.push(assignment.activity);
        });

        res.json(Array.from(professionalsMap.values()));
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar profissionais da obra' });
    }
});

// ========== GESTÃO DE DISCIPLINAS ==========
// Get all disciplines (grouped or flat)
app.get('/api/disciplines', async (req, res) => {
    const { projectId } = req.query;
    try {
        const disciplines = await prisma.discipline.findMany({
            where: projectId ? { projectId: projectId as string } : undefined,
            include: {
                project: { select: { nome: true } },
                responsible: { select: { nome: true } },
                _count: { select: { activities: true } }
            },
            orderBy: { codigo: 'asc' }
        });

        // Group by category
        const grouped = disciplines.reduce((acc: any, disc) => {
            if (!acc[disc.category]) acc[disc.category] = [];
            acc[disc.category].push(disc);
            return acc;
        }, {});

        res.json({ disciplines, grouped });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar disciplinas' });
    }
});

// Get discipline details
app.get('/api/disciplines/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const discipline = await prisma.discipline.findUnique({
            where: { id },
            include: {
                project: { include: { client: true } },
                responsible: { include: { user: true } },
                activities: {
                    include: {
                        assignments: {
                            include: { professional: true }
                        }
                    }
                },
                checklistItems: true
            }
        });

        if (!discipline) {
            return res.status(404).json({ error: 'Disciplina não encontrada' });
        }

        // Find other projects using this discipline code
        const relatedProjects = await prisma.project.findMany({
            where: {
                disciplines: {
                    some: { codigo: discipline.codigo }
                }
            },
            include: { client: true }
        });

        res.json({ discipline, relatedProjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar detalhes da disciplina' });
    }
});

// ========== GESTÃO DE ARQUIVOS DE PROJETO ==========
// Upload project file with classification
app.post('/api/projects/:id/files', async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, fase, revisao, folha, url, extensao, disciplineId, origem, faseObra, tags } = req.body;

    try {
        const file = await prisma.projectFile.create({
            data: {
                projectId: id,
                disciplineId,
                nome,
                tipo,
                fase,
                revisao: revisao || 'R0',
                folha,
                url,
                extensao,
                origem,
                faseObra,
                tags: tags ? JSON.stringify(tags) : null
            }
        });

        // Auto-update discipline status if linked
        if (disciplineId) {
            await prisma.discipline.update({
                where: { id: disciplineId },
                data: {
                    status: 'EM_DESENVOLVIMENTO',
                    versaoAtual: revisao || 'R0'
                }
            });
        }

        res.json(file);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
    }
});

// Get project files
app.get('/api/projects/:id/files', async (req, res) => {
    const { id } = req.params;
    const { disciplineId, origem, faseObra } = req.query;

    try {
        const where: any = { projectId: id };
        if (disciplineId) where.disciplineId = disciplineId as string;
        if (origem) where.origem = origem as string;
        if (faseObra) where.faseObra = faseObra as string;

        const files = await prisma.projectFile.findMany({
            where,
            orderBy: { criadoEm: 'desc' }
        });

        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar arquivos do projeto' });
    }
});

// ========== GESTÃO DE ESTOQUE ==========
// Get stock movements with context filter
app.get('/api/stock/movements', async (req, res) => {
    const { context, obraId } = req.query;

    try {
        const where: any = {};

        // context=obra: only movements with obraId
        // context=local: only movements without obraId (almoxarifado)
        if (context === 'obra') {
            where.obraId = { not: null };
            if (obraId) where.obraId = obraId as string;
        } else if (context === 'local') {
            where.obraId = null;
        }

        const movements = await prisma.stockMovement.findMany({
            where,
            include: {
                usuario: { select: { nome: true } },
                obra: { select: { nome: true } }
            },
            orderBy: { criadoEm: 'desc' }
        });

        res.json(movements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar movimentações de estoque' });
    }
});

// Create stock movement
app.post('/api/stock/movements', async (req, res) => {
    const { tipo, item, quantidade, unidade, obraId, usuarioId, observacao } = req.body;

    try {
        const movement = await prisma.stockMovement.create({
            data: { tipo, item, quantidade, unidade, obraId, usuarioId, observacao }
        });

        res.json(movement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar movimentação de estoque' });
    }
});

// ========== GESTÃO DE FROTA ==========
// CRUD for vehicles
app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            include: { responsavel: { select: { nome: true } } },
            orderBy: { placa: 'asc' }
        });
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar veículos' });
    }
});

app.post('/api/vehicles', async (req, res) => {
    const { placa, modelo, marca, tipo, cor, ano, responsavelId } = req.body;

    try {
        const vehicle = await prisma.vehicle.create({
            data: { placa, modelo, marca, tipo, cor, ano, responsavelId, status: 'DISPONIVEL' }
        });
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar veículo' });
    }
});

app.patch('/api/vehicles/:id', async (req, res) => {
    const { id } = req.params;
    const { modelo, marca, tipo, cor, ano, responsavelId, status, quilometragem } = req.body;

    try {
        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: { modelo, marca, tipo, cor, ano, responsavelId, status, quilometragem }
        });
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar veículo' });
    }
});

app.delete('/api/vehicles/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.vehicle.delete({ where: { id } });
        res.json({ message: 'Veículo removido com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao remover veículo' });
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

// ========== FASE 1: DP (DEPARTAMENTO PESSOAL) ==========

// Employees: Funcionários CLT
app.get('/api/employees', async (req, res) => {
    try {
        const { status, departamento } = req.query;
        const where: any = {};
        if (status) where.statusAtual = status;
        if (departamento) where.departamento = departamento;

        const employees = await prisma.employee.findMany({
            where,
            include: {
                user: { select: { nome: true, email: true } },
                _count: { select: { payrolls: true, asos: true, accidents: true } }
            },
            orderBy: { nome: 'asc' }
        });
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar funcionários' });
    }
});

app.post('/api/employees', async (req, res) => {
    const {
        userId, nome, cpf, rg, dataNascimento, endereco, contatos,
        cargo, departamento, salario, dataAdmissao
    } = req.body;
    try {
        const employee = await prisma.employee.create({
            data: {
                userId,
                nome,
                cpf,
                rg,
                dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
                endereco,
                contatos,
                cargo,
                departamento,
                salario,
                dataAdmissao: new Date(dataAdmissao),
                statusAtual: 'ATIVO'
            }
        });
        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar funcionário' });
    }
});

app.get('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await prisma.employee.findUnique({
            where: { id },
            include: {
                user: { select: { nome: true, email: true } },
                payrolls: { orderBy: { mesReferencia: 'desc' }, take: 12 },
                benefits: { include: { benefit: true } },
                asos: { orderBy: { dataExame: 'desc' } },
                accidents: { orderBy: { dataOcorrencia: 'desc' } },
                epiDistributions: { orderBy: { dataEntrega: 'desc' } },
                exitInterview: true
            }
        });
        if (!employee) return res.status(404).json({ error: 'Funcionário não encontrado' });
        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar funcionário' });
    }
});

app.patch('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { statusAtual, dataDemissao, motivoDemissao, salario, cargo, departamento } = req.body;
    try {
        const employee = await prisma.employee.update({
            where: { id },
            data: {
                statusAtual,
                dataDemissao: dataDemissao ? new Date(dataDemissao) : undefined,
                motivoDemissao,
                salario,
                cargo,
                departamento
            }
        });
        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }
});

// Payrolls: Folha de Pagamento
app.get('/api/payrolls', async (req, res) => {
    try {
        const { mesReferencia, status } = req.query;
        const where: any = {};
        if (mesReferencia) where.mesReferencia = new Date(mesReferencia as string);
        if (status) where.status = status;

        const payrolls = await prisma.payroll.findMany({
            where,
            include: { employee: { select: { nome: true, cpf: true, cargo: true } } },
            orderBy: { mesReferencia: 'desc' }
        });
        res.json(payrolls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar folhas de pagamento' });
    }
});

app.post('/api/employees/:id/payroll', async (req, res) => {
    const { id } = req.params;
    const { mesReferencia, salarioBase, horasExtras, bonificacoes, descontos } = req.body;
    try {
        const salarioLiquido = salarioBase + (horasExtras || 0) + (bonificacoes || 0) - (descontos || 0);
        const payroll = await prisma.payroll.create({
            data: {
                employeeId: id,
                mesReferencia: new Date(mesReferencia),
                salarioBase,
                horasExtras,
                bonificacoes,
                descontos,
                salarioLiquido,
                status: 'PENDENTE'
            }
        });
        res.json(payroll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao gerar folha de pagamento' });
    }
});

app.patch('/api/payrolls/:id', async (req, res) => {
    const { id } = req.params;
    const { status, dataPagamento } = req.body;
    try {
        const payroll = await prisma.payroll.update({
            where: { id },
            data: {
                status,
                dataPagamento: dataPagamento ? new Date(dataPagamento) : undefined
            }
        });
        res.json(payroll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar folha de pagamento' });
    }
});

// Benefits: Benefícios
app.get('/api/benefits', async (req, res) => {
    try {
        const benefits = await prisma.benefit.findMany({
            include: { _count: { select: { employees: true } } }
        });
        res.json(benefits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar benefícios' });
    }
});

app.post('/api/benefits', async (req, res) => {
    const { nome, tipo, valor, descricao } = req.body;
    try {
        const benefit = await prisma.benefit.create({
            data: { nome, tipo, valor, descricao }
        });
        res.json(benefit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar benefício' });
    }
});

app.post('/api/employees/:id/benefits', async (req, res) => {
    const { id } = req.params;
    const { benefitId, dataInicio, valorMensal } = req.body;
    try {
        const employeeBenefit = await prisma.employeeBenefit.create({
            data: {
                employeeId: id,
                benefitId,
                dataInicio: new Date(dataInicio),
                valorMensal
            },
            include: { benefit: true }
        });
        res.json(employeeBenefit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao vincular benefício' });
    }
});

// Third Party Contracts: Terceirizados
app.get('/api/third-party-contracts', async (req, res) => {
    try {
        const { status } = req.query;
        const where = status ? { status: status as string } : {};
        const contracts = await prisma.thirdPartyContract.findMany({
            where,
            orderBy: { dataInicio: 'desc' }
        });
        res.json(contracts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar contratos terceirizados' });
    }
});

app.post('/api/third-party-contracts', async (req, res) => {
    const { empresa, cnpj, contato, servico, valorMensal, dataInicio } = req.body;
    try {
        const contract = await prisma.thirdPartyContract.create({
            data: {
                empresa,
                cnpj,
                contato,
                servico,
                valorMensal,
                dataInicio: new Date(dataInicio),
                status: 'ATIVO'
            }
        });
        res.json(contract);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar contrato terceirizado' });
    }
});

// ASO: Atestados de Saúde Ocupacional
app.get('/api/asos', async (req, res) => {
    try {
        const { employeeId, tipo } = req.query;
        const where: any = {};
        if (employeeId) where.employeeId = employeeId;
        if (tipo) where.tipo = tipo;

        const asos = await prisma.aSO.findMany({
            where,
            include: { employee: { select: { nome: true, cpf: true } } },
            orderBy: { dataExame: 'desc' }
        });
        res.json(asos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar ASOs' });
    }
});

app.post('/api/asos', async (req, res) => {
    const { employeeId, tipo, dataExame, dataValidade, medico, clinica, resultado, restricoes, anexoUrl } = req.body;
    try {
        const aso = await prisma.aSO.create({
            data: {
                employeeId,
                tipo,
                dataExame: new Date(dataExame),
                dataValidade: dataValidade ? new Date(dataValidade) : null,
                medico,
                clinica,
                resultado,
                restricoes,
                anexoUrl
            }
        });
        res.json(aso);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar ASO' });
    }
});

// Exit Interviews: Entrevistas de Desligamento
app.get('/api/exit-interviews', async (req, res) => {
    try {
        const interviews = await prisma.exitInterview.findMany({
            include: { employee: { select: { nome: true, cpf: true, cargo: true } } },
            orderBy: { dataEntrevista: 'desc' }
        });
        res.json(interviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar entrevistas de desligamento' });
    }
});

app.post('/api/exit-interviews', async (req, res) => {
    const { employeeId, dataEntrevista, entrevistador, motivoSaida, feedbackJson, notaSatisfacao, sugestoes, voltaria } = req.body;
    try {
        const interview = await prisma.exitInterview.create({
            data: {
                employeeId,
                dataEntrevista: new Date(dataEntrevista),
                entrevistador,
                motivoSaida,
                feedbackJson,
                notaSatisfacao,
                sugestoes,
                voltaria
            }
        });
        res.json(interview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar entrevista de desligamento' });
    }
});

// ========== FASE 1: DST (SEGURANÇA DO TRABALHO) ==========

// Safety Inspections: Inspeções de Segurança
app.get('/api/safety-inspections', async (req, res) => {
    try {
        const { projectId, status } = req.query;
        const where: any = {};
        if (projectId) where.projectId = projectId;
        if (status) where.status = status;

        const inspections = await prisma.safetyInspection.findMany({
            where,
            include: {
                project: { select: { nome: true } },
                inspector: { select: { nome: true } }
            },
            orderBy: { dataInspecao: 'desc' }
        });
        res.json(inspections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar inspeções de segurança' });
    }
});

app.post('/api/safety-inspections', async (req, res) => {
    const { projectId, inspectorId, dataInspecao, tipo, checklistJson, conformidades, naoConformidades, observacoes } = req.body;
    try {
        const inspection = await prisma.safetyInspection.create({
            data: {
                projectId,
                inspectorId,
                dataInspecao: new Date(dataInspecao),
                tipo,
                checklistJson,
                conformidades: conformidades || 0,
                naoConformidades: naoConformidades || 0,
                observacoes,
                status: 'PENDENTE'
            }
        });
        res.json(inspection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar inspeção de segurança' });
    }
});

app.patch('/api/safety-inspections/:id', async (req, res) => {
    const { id } = req.params;
    const { status, observacoes } = req.body;
    try {
        const inspection = await prisma.safetyInspection.update({
            where: { id },
            data: { status, observacoes }
        });
        res.json(inspection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar inspeção' });
    }
});

// Accidents: Acidentes de Trabalho
app.get('/api/accidents', async (req, res) => {
    try {
        const { employeeId, projectId, status, gravidade } = req.query;
        const where: any = {};
        if (employeeId) where.employeeId = employeeId;
        if (projectId) where.projectId = projectId;
        if (status) where.status = status;
        if (gravidade) where.gravidade = gravidade;

        const accidents = await prisma.accident.findMany({
            where,
            include: {
                employee: { select: { nome: true, cpf: true } },
                project: { select: { nome: true } }
            },
            orderBy: { dataOcorrencia: 'desc' }
        });
        res.json(accidents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar acidentes' });
    }
});

app.post('/api/accidents', async (req, res) => {
    const {
        employeeId, projectId, dataOcorrencia, horaOcorrencia, local, descricao,
        gravidade, tipoAcidente, partesCorpo, testemunhas
    } = req.body;
    try {
        const accident = await prisma.accident.create({
            data: {
                employeeId,
                projectId,
                dataOcorrencia: new Date(dataOcorrencia),
                horaOcorrencia,
                local,
                descricao,
                gravidade,
                tipoAcidente,
                partesCorpo,
                testemunhas,
                catEmitida: false,
                status: 'ABERTO'
            }
        });
        res.json(accident);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar acidente' });
    }
});

app.patch('/api/accidents/:id', async (req, res) => {
    const { id } = req.params;
    const { status, investigacao, medidasCorretivas, dataAfastamento, diasAfastado } = req.body;
    try {
        const accident = await prisma.accident.update({
            where: { id },
            data: {
                status,
                investigacao,
                medidasCorretivas,
                dataAfastamento: dataAfastamento ? new Date(dataAfastamento) : undefined,
                diasAfastado
            }
        });
        res.json(accident);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar acidente' });
    }
});

app.post('/api/accidents/:id/cat', async (req, res) => {
    const { id } = req.params;
    const { numeroCAT } = req.body;
    try {
        const accident = await prisma.accident.update({
            where: { id },
            data: {
                catEmitida: true,
                numeroCAT,
                status: 'INVESTIGACAO'
            }
        });
        res.json(accident);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao emitir CAT' });
    }
});

// EPI Distributions: Distribuição de EPIs
app.get('/api/epi-distributions', async (req, res) => {
    try {
        const { employeeId, status } = req.query;
        const where: any = {};
        if (employeeId) where.employeeId = employeeId;
        if (status) where.status = status;

        const distributions = await prisma.ePIDistribution.findMany({
            where,
            include: {
                employee: { select: { nome: true, cpf: true } }
            },
            orderBy: { dataEntrega: 'desc' }
        });
        res.json(distributions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar distribuições de EPI' });
    }
});

app.post('/api/epi-distributions', async (req, res) => {
    const { employeeId, epiTipo, marca, quantidade, dataEntrega, dataValidade, nf, assinaturaUrl } = req.body;
    try {
        const distribution = await prisma.ePIDistribution.create({
            data: {
                employeeId,
                epiTipo,
                marca,
                quantidade: quantidade || 1,
                dataEntrega: new Date(dataEntrega),
                dataValidade: dataValidade ? new Date(dataValidade) : null,
                nf,
                assinaturaUrl,
                status: 'EM_USO'
            }
        });
        res.json(distribution);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao distribuir EPI' });
    }
});

// ========== FASE 1: LOGÍSTICA (Complemento) ==========

// Tools: Ferramentas
app.get('/api/tools', async (req, res) => {
    try {
        const { estado, tipo } = req.query;
        const where: any = {};
        if (estado) where.estado = estado;
        if (tipo) where.tipo = tipo;

        const tools = await prisma.tool.findMany({
            where,
            include: {
                loans: {
                    where: { dataRetorno: null },
                    include: { usuario: { select: { nome: true } } }
                }
            },
            orderBy: { nome: 'asc' }
        });
        res.json(tools);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar ferramentas' });
    }
});

app.post('/api/tools', async (req, res) => {
    const { codigo, nome, tipo, marca, estado, localizacao, responsavel, dataAquisicao, valorAquisicao } = req.body;
    try {
        const tool = await prisma.tool.create({
            data: {
                codigo,
                nome,
                tipo,
                marca,
                estado: estado || 'BOM',
                localizacao,
                responsavel,
                dataAquisicao: dataAquisicao ? new Date(dataAquisicao) : null,
                valorAquisicao
            }
        });
        res.json(tool);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar ferramenta' });
    }
});

app.post('/api/tools/:id/loan', async (req, res) => {
    const { id } = req.params;
    const { usuarioId, projectId, dataSaida, estadoSaida } = req.body;
    try {
        const loan = await prisma.toolLoan.create({
            data: {
                toolId: id,
                usuarioId,
                projectId,
                dataSaida: new Date(dataSaida),
                estadoSaida
            }
        });
        res.json(loan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao emprestar ferramenta' });
    }
});

app.patch('/api/tool-loans/:id/return', async (req, res) => {
    const { id } = req.params;
    const { dataRetorno, estadoRetorno, observacoes } = req.body;
    try {
        const loan = await prisma.toolLoan.update({
            where: { id },
            data: {
                dataRetorno: new Date(dataRetorno),
                estadoRetorno,
                observacoes
            }
        });

        // Update tool estado if returned damaged
        if (estadoRetorno === 'DANIFICADO') {
            await prisma.tool.update({
                where: { id: loan.toolId },
                data: { estado: 'DANIFICADO' }
            });
        }

        res.json(loan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao devolver ferramenta' });
    }
});

// Vehicle Maintenances: Manutenções Veiculares
app.get('/api/vehicles/:id/maintenances', async (req, res) => {
    const { id } = req.params;
    try {
        const maintenances = await prisma.maintenanceRecord.findMany({
            where: { vehicleId: id },
            orderBy: { dataExecucao: 'desc' }
        });
        res.json(maintenances);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar manutenções' });
    }
});

app.post('/api/vehicles/:id/maintenances', async (req, res) => {
    const { id } = req.params;
    const { tipo, descricao, oficina, valor, dataExecucao, quilometragem, proximaRevisao, anexoUrl } = req.body;
    try {
        const maintenance = await prisma.maintenanceRecord.create({
            data: {
                vehicleId: id,
                tipo,
                descricao,
                oficina,
                valor,
                dataExecucao: new Date(dataExecucao),
                quilometragem,
                proximaRevisao: proximaRevisao ? new Date(proximaRevisao) : null,
                anexoUrl
            }
        });
        res.json(maintenance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar manutenção' });
    }
});

app.listen(port, () => {
    console.log(`[VERCFLOW API]: Server is running at http://localhost:${port}`);
});

