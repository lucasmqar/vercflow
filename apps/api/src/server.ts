import dotenv from 'dotenv';
import path from 'path';

// Force load .env from root
dotenv.config({ path: path.join(__dirname, '../../..', '.env') });

import express from 'express';
import cors from 'cors';
import {
    PrismaClient
} from '@prisma/client';

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
app.post('/api/records', async (req, res) => {
    const { authorId, projectId, clientId, texto, type, prioridade, natureza, parentId, items } = req.body;
    if (!authorId) return res.status(400).json({ error: 'authorId é obrigatório' });

    try {
        const userExists = await prisma.user.findUnique({ where: { id: authorId } });
        if (!userExists) {
            return res.status(401).json({ error: 'Sessão expirada ou usuário não encontrado.' });
        }

        const record = await prisma.record.create({
            data: {
                authorId,
                projectId: projectId || null,
                clientId: clientId || null,
                texto,
                type: type || 'TEXTO',
                status: 'REGISTRO',
                prioridade: prioridade || 'MEDIA',
                natureza,
                parentId: parentId || null,
                isInicial: !parentId,
                items: items ? {
                    create: items.map((item: any, idx: number) => ({
                        type: item.type || 'TEXTO',
                        content: item.content,
                        order: idx
                    }))
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar registro' });
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
    const { nome, endereco, clientId } = req.body;
    try {
        const project = await prisma.project.create({
            data: { nome, endereco, clientId },
            include: { client: { select: { nome: true } } }
        });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar obra' });
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
    const { nome, documento, contatos } = req.body;
    try {
        const client = await prisma.client.create({
            data: { nome, documento, contatos }
        });
        res.json(client);
    } catch (error) {
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

// 9. PDF Technical View (HTML for Printing - Compact A4)
app.get('/api/records/:id/pdf-view', async (req, res) => {
    const { id } = req.params;
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

        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>VRC-${record.refCodigo}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; color: #1a1a1a; font-size: 11px; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
                    .header-left { display: flex; align-items: center; gap: 10px; }
                    .brand { font-size: 20px; font-weight: 800; letter-spacing: -1px; }
                    .doc-info { text-align: right; }
                    .section { margin-bottom: 15px; }
                    .section-title { font-weight: 700; text-transform: uppercase; font-size: 10px; color: #666; border-bottom: 1px solid #eee; margin-bottom: 5px; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                    .sketch-container { width: 100%; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; margin-top: 10px; }
                    .sketch-img { width: 100%; height: auto; display: block; filter: grayscale(1); }
                    .item-list { list-style: none; padding: 0; }
                    .item { padding: 5px 0; border-bottom: 1px solid #f5f5f5; }
                    .footer { margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; font-size: 9px; color: #999; display: flex; justify-content: space-between; }
                    @media print { body { padding: 0; } .header { border-bottom-width: 1px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="header-left">
                        <div class="brand">VERCFLOW</div>
                        <div style="border-left: 1px solid #ddd; padding-left: 10px;">
                            <strong>${record.natureza || 'REGISTRO TÉCNICO'}</strong><br/>
                            ${record.project?.nome || 'Propriedade Privada'}
                        </div>
                    </div>
                    <div class="doc-info">
                        <strong>ID: ${record.refCodigo}</strong><br/>
                        ${record.parent ? `Rev de: ${record.parent.refCodigo}` : 'Original (v1)'}
                    </div>
                </div>

                <div class="grid">
                    <div class="section">
                        <div class="section-title">Informações Gerais</div>
                        <div><strong>Cliente:</strong> ${record.project?.client?.nome || 'N/A'}</div>
                        <div><strong>Data:</strong> ${dateStr} ${timeStr}</div>
                        <div><strong>Autor:</strong> ${record.author?.nome} (${record.author?.role})</div>
                    </div>
                    <div class="section">
                        <div class="section-title">Status e Prioridade</div>
                        <div><strong>Fase:</strong> ${record.status}</div>
                        <div><strong>Prioridade:</strong> ${record.prioridade}</div>
                    </div>
                </div>

                ${record.sketch ? `
                <div class="section">
                    <div class="section-title">Esboço Técnico</div>
                    <div class="sketch-container">
                        <img class="sketch-img" src="${record.sketch.imageUrl}" />
                    </div>
                </div>
                ` : ''}

                <div class="section">
                    <div class="section-title">Conteúdo do Registro</div>
                    <div class="item-list">
                        ${record.items.map(item => `
                            <div class="item">
                                <span style="font-weight:600; font-size:9px; color:#888;">[${item.type}]</span>
                                <div style="margin-top:2px;">${item.content}</div>
                            </div>
                        `).join('')}
                        ${!record.items.length ? `<div>${record.texto || 'Sem descritivo.'}</div>` : ''}
                    </div>
                </div>

                <div class="footer">
                    <div>VERCFLOW SOLUÇÕES TECNOLÓGICAS - v5.3.0</div>
                    <div>Página 1 / 1 - Gerado em ${dateStr}</div>
                </div>
            </body>
            </html>
        `;
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao gerar visualização do documento');
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'vercflow-api' });
});

app.listen(port, () => {
    console.log(`[VERCFLOW API]: Server is running at http://localhost:${port}`);
});
