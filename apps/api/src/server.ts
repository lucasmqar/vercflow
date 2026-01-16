import dotenv from 'dotenv';
import path from 'path';

// Force load .env from root
dotenv.config({ path: path.join(__dirname, '../../..', '.env') });

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

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
        if (!user || user.senhaHash !== senha) { // Simples para MVP
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

// 2. Records: Capture (Fluxo 1)
app.post('/api/records', async (req, res) => {
    const { authorId, projectId, texto, type } = req.body;
    if (!authorId) return res.status(400).json({ error: 'authorId é obrigatório' });

    try {
        const userExists = await prisma.user.findUnique({ where: { id: authorId } });
        if (!userExists) {
            return res.status(401).json({ error: 'Sessão expirada ou usuário não encontrado. Por favor, faça login novamente.' });
        }

        const record = await prisma.record.create({
            data: {
                authorId,
                projectId: projectId || null,
                texto,
                type: type || 'TEXTO',
                status: 'RASCUNHO',
            },
            include: {
                author: { select: { nome: true, role: true } },
                project: { select: { nome: true } }
            }
        });

        res.json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar registro' });
    }
});

// 3. Records: Timeline (Experiência chat-like)
app.get('/api/records', async (req, res) => {
    const { projectId, clientId, status } = req.query;

    try {
        const records = await prisma.record.findMany({
            where: {
                projectId: projectId ? String(projectId) : undefined,
                clientId: clientId ? String(clientId) : undefined,
                status: status ? String(status) : undefined,
            },
            include: {
                author: { select: { nome: true, role: true } },
                project: { select: { nome: true } },
                sketch: true,
                documents: true
            },
            orderBy: { criadoEm: 'desc' }
        });

        res.json(records);
    } catch (error) {
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
                }
            }
        });
        res.json(professionals);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar profissionais' });
    }
});

app.post('/api/professionals', async (req, res) => {
    const { nome, tipo, documento, contatos } = req.body;
    try {
        const prof = await prisma.professional.create({
            data: { nome, tipo, documento, contatos }
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
                pdfUrl: `/api/docs/pdf-stub-${id}.pdf` // In reality, calls docs-engine
            }
        });

        res.json({ message: 'Esboço salvo e PDF gerado', sketch });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar esboço' });
    }
});

app.patch('/api/records/:id', async (req, res) => {
    const { id } = req.params;
    const { status, prioridade, projectId } = req.body;

    try {
        const record = await prisma.record.update({
            where: { id },
            data: {
                status,
                prioridade,
                projectId
            },
            include: {
                author: { select: { nome: true, role: true } },
                project: { select: { nome: true } },
                sketch: true,
                documents: true
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
            data: { nome, email, senhaHash, role: role || 'USUARIO_PADRAO' }
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

// 8. Activities: Retrieval
app.get('/api/activities', async (req, res) => {
    try {
        const activities = await prisma.activity.findMany({
            include: {
                project: { select: { nome: true } },
                record: { select: { texto: true, type: true } },
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

// 9. Records: Listing (Enhanced)
app.get('/api/records', async (req, res) => {
    try {
        const records = await prisma.record.findMany({
            include: {
                author: { select: { nome: true, role: true } },
                project: { select: { nome: true } },
                sketch: true,
                documents: true
            },
            orderBy: { criadoEm: 'desc' }
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar registros' });
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

// 9. PDF Technical View (HTML for Printing)
app.get('/api/records/:id/pdf-view', async (req, res) => {
    const { id } = req.params;
    try {
        const record = await (prisma as any).record.findUnique({
            where: { id },
            include: {
                sketch: true,
                author: { select: { nome: true, role: true } },
                project: { include: { client: true } }
            }
        });

        if (!record || !record.sketch) return res.status(404).send('Esboço não encontrado');

        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>VERCFLOW - Documento Técnico #${id}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700&display=swap');
                    body { 
                        font-family: 'Outfit', sans-serif; 
                        margin: 0; padding: 40px; 
                        background: #fff; color: #1a1a1a;
                        -webkit-print-color-adjust: exact;
                        display: flex;
                        flex-direction: column;
                        min-height: 90vh;
                    }
                    .glass-header {
                        padding: 30px;
                        border-radius: 24px;
                        background: rgba(240, 240, 240, 0.4);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(0,0,0,0.08);
                        margin-bottom: 40px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
                    }
                    .brand { font-size: 28px; font-weight: 800; letter-spacing: -1.5px; color: #333; }
                    .metadata { text-align: right; font-size: 13px; color: #555; line-height: 1.6; }
                    .canvas-container {
                        width: 100%;
                        aspect-ratio: 1.6;
                        background: #fff;
                        border: 1px solid #e5e7eb;
                        border-radius: 16px;
                        position: relative;
                        overflow: hidden;
                        box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
                    }
                    .pencil-sketch {
                        width: 100%; height: 100%; object-fit: contain;
                        filter: grayscale(1) contrast(1.2); 
                    }
                    .content-section {
                        flex: 1;
                        padding: 20px 0;
                    }
                    .inst-footer {
                        margin-top: auto;
                        padding-top: 30px;
                        border-top: 2px solid #f3f4f6;
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        color: #9ca3af;
                        font-size: 11px;
                        letter-spacing: 0.5px;
                    }
                    .stamp-box {
                        border: 2px solid #ef4444;
                        color: #ef4444;
                        padding: 8px 15px;
                        font-weight: 800;
                        text-transform: uppercase;
                        transform: rotate(-3deg);
                        border-radius: 8px;
                        font-size: 14px;
                        display: inline-block;
                        margin-bottom: 10px;
                    }
                    .author-info {
                        background: #f9fafb;
                        padding: 15px 25px;
                        border-radius: 12px;
                        display: inline-block;
                        margin-top: 20px;
                    }
                    @media print {
                        body { padding: 0; }
                        .glass-header { border-radius: 0; box-shadow: none; border: none; border-bottom: 1px solid #eee; }
                    }
                </style>
            </head>
            <body>
                <div class="glass-header">
                    <div>
                        <div class="brand">VERC<span style="color:#666">FLOW</span></div>
                        <div style="font-size: 14px; font-weight: 600; margin-top: 6px; color: #111;">
                            PROJETO: ${record.project?.nome || 'PROJETO NÃO VINCULADO'}
                        </div>
                    </div>
                    <div class="metadata">
                        <div style="font-weight: 700; color: #111">DOC REF: #${record.id.slice(-8).toUpperCase()}</div>
                        <div>DATA: ${dateStr} | HORA: ${timeStr}</div>
                        <div>AUTOR: ${record.author?.nome || 'N/A'}</div>
                    </div>
                </div>

                <div class="content-section">
                    <div class="canvas-container">
                        <img class="pencil-sketch" src="${record.sketch.imageUrl}" />
                    </div>

                    <div style="margin-top: 35px;">
                        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #9ca3af; letter-spacing: 2px;">Observações Técnicas</span>
                        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-top: 10px; max-width: 800px;">
                            ${record.texto || 'Nenhuma nota descritiva anexada a este registro técnico.'}
                        </p>
                    </div>

                    <div class="author-info">
                        <div style="font-size: 10px; font-weight: 700; color: #9ca3af; margin-bottom: 4px;">ASSINATURA DIGITAL DO RESPONSÁVEL</div>
                        <div style="font-weight: 700; color: #111; font-size: 15px;">${record.author?.nome}</div>
                        <div style="font-size: 12px; color: #6b7280;">${record.author?.role} - VERCFLOW ID:${record.authorId.slice(0, 8)}</div>
                    </div>
                </div>

                <div class="inst-footer">
                    <div>
                        <div class="stamp-box">VERCFLOW CERTIFIED</div>
                        <p style="margin: 0; font-weight: 600;">VERCFLOW SOLUÇÕES TECNOLÓGICAS LTDA</p>
                        <p style="margin: 2px 0;">CNPJ: 45.123.890/0001-55 | CREA-SP: 209938442</p>
                        <p style="margin: 2px 0;">Av. Brig. Faria Lima, 2011 - 14º Andar - São Paulo/SP</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-weight: 700; color: #4b5563;">www.vercflow.com.br</p>
                        <p>suporte@vercflow.com.br</p>
                    </div>
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

