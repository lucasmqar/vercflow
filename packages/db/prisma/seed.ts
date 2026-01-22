import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting Robust Seed...');

    // 1. Clean data in order
    await prisma.auditLog.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.raciAssignment.deleteMany();
    await prisma.activityAssignment.deleteMany();
    await prisma.checklistItem.deleteMany();
    await prisma.request.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.document.deleteMany();
    await prisma.sketch.deleteMany();
    await prisma.recordItem.deleteMany();
    await prisma.record.deleteMany();
    await prisma.project.deleteMany();
    await prisma.client.deleteMany();
    await prisma.professional.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Database cleaned.');

    // 2. Create Users for all roles
    const users = [
        { nome: 'Admin Vercflow', email: 'admin@vercflow.com', senhaHash: 'admin123', role: 'ADMIN' },
        { nome: 'Lucas CEO', email: 'lucas@vercflow.com', senhaHash: 'ceo123', role: 'CEO' },
        { nome: 'Marcos Gestor', email: 'marcos@vercflow.com', senhaHash: 'gestor123', role: 'GESTOR' },
        { nome: 'Ana Triagista', email: 'ana@vercflow.com', senhaHash: 'triagem123', role: 'TRIAGISTA' },
        { nome: 'Ricardo Operacional', email: 'ricardo@vercflow.com', senhaHash: 'ricardo123', role: 'OPERACIONAL' },
        { nome: 'Joaquim Engenheiro', email: 'joaquim@vercflow.com', senhaHash: 'joaquim123', role: 'PROFISSIONAL_INTERNO' },
        { nome: 'Beatriz Arquiteta', email: 'beatriz@vercflow.com', senhaHash: 'beatriz123', role: 'PROFISSIONAL_INTERNO' },
        { nome: 'Carlos Projetista', email: 'carlos@vercflow.com', senhaHash: 'carlos123', role: 'PROFISSIONAL_INTERNO' },
        { nome: 'Marmoraria Silva', email: 'silva@vercflow.com', senhaHash: 'silva123', role: 'PROFISSIONAL_EXTERNO' },
        { nome: 'Eletrica Volt', email: 'volt@vercflow.com', senhaHash: 'volt123', role: 'PROFISSIONAL_EXTERNO' },
        { nome: 'Hidro Flow', email: 'flow@vercflow.com', senhaHash: 'flow123', role: 'PROFISSIONAL_EXTERNO' },
        { nome: 'Gesso Art', email: 'art@vercflow.com', senhaHash: 'art123', role: 'PROFISSIONAL_EXTERNO' },
        { nome: 'Pintura Pro', email: 'pintura@vercflow.com', senhaHash: 'pintura123', role: 'PROFISSIONAL_EXTERNO' },
    ];

    const createdUsers: any[] = [];
    for (const u of users) {
        const user = await prisma.user.create({ data: u });
        createdUsers.push(user);
    }
    console.log(`👤 ${createdUsers.length} Users created.`);

    // 3. Create Professionals linked to Users (where applicable)
    const prosData = [
        { nome: 'Joaquim Engenheiro', tipo: 'INTERNO_ENGENHEIRO', userId: createdUsers.find(u => u.email === 'joaquim@vercflow.com').id },
        { nome: 'Beatriz Arquiteta', tipo: 'INTERNO_ARQUITETO', userId: createdUsers.find(u => u.email === 'beatriz@vercflow.com').id },
        { nome: 'Carlos Projetista', tipo: 'INTERNO_PROJETISTA', userId: createdUsers.find(u => u.email === 'carlos@vercflow.com').id },
        { nome: 'Marmoraria Silva', tipo: 'EXTERNO_MAO_OBRA', userId: createdUsers.find(u => u.email === 'silva@vercflow.com').id },
        { nome: 'Eletrica Volt', tipo: 'EXTERNO_MAO_OBRA', userId: createdUsers.find(u => u.email === 'volt@vercflow.com').id },
        { nome: 'Hidro Flow', tipo: 'EXTERNO_MAO_OBRA', userId: createdUsers.find(u => u.email === 'flow@vercflow.com').id },
        { nome: 'Gesso Art', tipo: 'EXTERNO_MAO_OBRA', userId: createdUsers.find(u => u.email === 'art@vercflow.com').id },
        { nome: 'Pintura Pro', tipo: 'EXTERNO_MAO_OBRA', userId: createdUsers.find(u => u.email === 'pintura@vercflow.com').id },
    ];

    const createdPros: any[] = [];
    for (const p of prosData) {
        const pro = await prisma.professional.create({ data: p });
        createdPros.push(pro);
    }
    console.log(`🛠️ ${createdPros.length} Professionals created.`);

    // 4. Create Clients
    const clients = [
        { nome: 'Construtora Horizonte', documento: '12.345.678/0001-90', contatos: 'contato@horizonte.com' },
        { nome: 'Grupo Alpha Invest', documento: '44.555.666/0001-11', contatos: 'financeiro@alpha.com' },
        { nome: 'Residencial Aurora Ltda', documento: '99.888.777/0001-00', contatos: 'sac@aurora.com' },
        { nome: 'Loft São Paulo', documento: '11.222.333/0001-44', contatos: 'contato@loftsp.com' },
        { nome: 'Hospital Care', documento: '55.444.333/0001-55', contatos: 'obras@hospitalcare.com' },
    ];

    const createdClients: any[] = [];
    for (const c of clients) {
        const client = await prisma.client.create({ data: c });
        createdClients.push(client);
    }
    console.log(`🏢 ${createdClients.length} Clients created.`);

    // 5. Create Projects (Obras)
    const projects = [
        { nome: 'Edifício Sky', endereco: 'Av. Paulista, 1000', status: 'ATIVA', clientId: createdClients[0].id },
        { nome: 'Residencial Aurora', endereco: 'Rua das Flores, 50', status: 'ATIVA', clientId: createdClients[2].id },
        { nome: 'Complexo Alpha', endereco: 'Rodovia Castelo Branco, KM 20', status: 'ATIVA', clientId: createdClients[1].id },
        { nome: 'Loft Pinheiros', endereco: 'Rua Gilberto Sabino, 100', status: 'ATIVA', clientId: createdClients[3].id },
        { nome: 'Ala Norte Hospital Care', endereco: 'Rua Itapeva, 400', status: 'ATIVA', clientId: createdClients[4].id },
        { nome: 'Reforma Sky 12º', endereco: 'Av. Paulista, 1000 - 12º Andar', status: 'ATIVA', clientId: createdClients[0].id },
        { nome: 'Condomínio Bela Vista', endereco: 'Rua Treze de Maio, 500', status: 'EM_PAUSA', clientId: createdClients[1].id },
        { nome: 'Retrofit Alpha', endereco: 'Av. Brigadeiro, 200', status: 'ATIVA', clientId: createdClients[1].id },
        { nome: 'Torre Sul Aurora', endereco: 'Rua das Flores, 55', status: 'ATIVA', clientId: createdClients[2].id },
        { nome: 'Edifício Infinity', endereco: 'Av. Faria Lima, 3000', status: 'CONCLUIDA', clientId: createdClients[3].id },
    ];

    const createdProjects: any[] = [];
    for (const p of projects) {
        const project = await prisma.project.create({ data: p });
        createdProjects.push(project);
    }
    console.log(`🏗️ ${createdProjects.length} Projects (Obras) created.`);

    // 6. Create Records (Captura/Esboço) - 40 registros
    console.log('📝 Creating 40 Records with new 6-phase flow...');
    const recordStatuses = ['REGISTRO', 'TRIAGEM', 'CLASSIFICACAO', 'ORDENACAO', 'VALIDACAO', 'DISTRIBUICAO'];

    for (let i = 1; i <= 40; i++) {
        const type = i <= 20 ? 'ESBOCO' : 'TEXTO';
        const author = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const project = createdProjects[Math.floor(Math.random() * createdProjects.length)];
        const status = recordStatuses[i % 6];
        const prio = i % 4 === 0 ? 'CRITICA' : i % 3 === 0 ? 'ALTA' : 'MEDIA';
        const natureza = i % 5 === 0 ? 'ORCAMENTO' : i % 3 === 0 ? 'TECNICO' : 'FINANCEIRO';

        const rec = await prisma.record.create({
            data: {
                authorId: author.id,
                projectId: project.id,
                texto: `Registro técnico de campo #${i}: Detalhamento de ${i % 2 === 0 ? 'instalações' : 'acabamentos'} na área ${i % 5}.`,
                type,
                status,
                prioridade: prio,
                natureza,
                refCodigo: `VRC-${2024}-${i.toString().padStart(4, '0')}`,
            }
        });

        // Add RecordItems (Multi-item support)
        await prisma.recordItem.create({
            data: {
                recordId: rec.id,
                type: 'TEXTO',
                content: `Descrição detalhada do item #${i}`,
                order: 1
            }
        });

        if (type === 'ESBOCO') {
            const sketchContent = JSON.stringify({ version: "5.3.0", objects: [{ type: 'path', path: [] }] });
            await prisma.recordItem.create({
                data: {
                    recordId: rec.id,
                    type: 'ESBOCO',
                    content: sketchContent,
                    order: 2
                }
            });

            await prisma.sketch.create({
                data: {
                    recordId: rec.id,
                    dataJson: sketchContent,
                    imageUrl: 'https://placehold.co/600x400?text=Esboço+' + i,
                }
            });

            await prisma.document.create({
                data: {
                    recordId: rec.id,
                    tipo: 'ESBOCO_TIMBRADO',
                    status: 'CONCLUIDO',
                    pdfUrl: `https://vercflow.com/docs/sketch_${rec.id}.pdf`
                }
            });
        }
    }

    // 7. Create Activities - 100 atividades
    console.log('🏃 Creating 100 Activities...');
    for (let i = 1; i <= 100; i++) {
        const project = createdProjects[Math.floor(Math.random() * createdProjects.length)];
        const statusIdx = Math.floor(Math.random() * 5);
        const status = ['PLANEJADO', 'EM_EXECUCAO', 'CONCLUIDO', 'BLOQUEADO', 'CANCELADO'][statusIdx];
        const prio = i % 5 === 0 ? 'CRITICA' : i % 3 === 0 ? 'ALTA' : 'MEDIA';

        const activity = await prisma.activity.create({
            data: {
                projectId: project.id,
                titulo: `Tarefa Operacional #${i}: ${['Impermeabilização', 'Alvenaria', 'Pintura', 'Gesso', 'Elétrica', 'Hidráulica'][i % 6]}`,
                descricao: `Escopo detalhado para execução da atividade #${i}. Verificar níveis e prumos.`,
                status,
                prioridade: prio,
                dataInicio: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
                dataFim: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
            }
        });

        // Assign professionals
        const pro = createdPros[Math.floor(Math.random() * createdPros.length)];
        await prisma.activityAssignment.create({
            data: {
                activityId: activity.id,
                professionalId: pro.id,
                valorPrevisto: 1000 + (Math.random() * 5000),
                valorReal: status === 'CONCLUIDO' ? 1000 + (Math.random() * 5000) : null,
            }
        });
    }

    // 8. Create Disciplines & Tasks (Legacy Sync)
    console.log('📚 Syncing Disciplines & Tasks...');
    for (const p of createdProjects) {
        const disciplinesList = [
            // 1. PROJETOS
            { codigo: '01.ARQ', name: 'Arquitetura', category: 'PROJETOS' },
            { codigo: '02.EST', name: 'Estrutural', category: 'PROJETOS' },
            { codigo: '03.HID', name: 'Hidráulica', category: 'PROJETOS' },
            { codigo: '04.ELE', name: 'Elétrica', category: 'PROJETOS' },
            { codigo: '05.MEC', name: 'Mecânica/Climatização', category: 'PROJETOS' },
            { codigo: '06.INC', name: 'Incêndio (PPCI)', category: 'PROJETOS' },
            { codigo: '07.AUT', name: 'Automação', category: 'PROJETOS' },
            // 2. SUDERV
            { codigo: '1.1.CER', name: 'Certidão Ocupação Solo', category: 'SUDERV' },
            { codigo: '1.2.ALV', name: 'Alvará de Construção', category: 'SUDERV' },
            { codigo: '1.3.REF', name: 'Alvará de Reforma', category: 'SUDERV' },
            { codigo: '1.4.HAB', name: 'Habite-se', category: 'SUDERV' },
            // 3. SEMMA
            { codigo: '2.1.USO', name: 'Uso do Solo (PJ)', category: 'SEMMA' },
            { codigo: '2.3.PRE', name: 'Prévia de Localização', category: 'SEMMA' },
            // 4. VIGILÂNCIA
            { codigo: '3.0.VIS', name: 'Vigilância Sanitária', category: 'VIGILANCIA' },
            // 5. FISCALIZAÇÃO
            { codigo: '4.0.FIS', name: 'Fiscalização de Obras', category: 'FISCALIZACAO' },
        ];

        for (const d of disciplinesList) {
            const disc = await prisma.discipline.create({
                data: {
                    projectId: p.id,
                    codigo: d.codigo,
                    name: d.name,
                    category: d.category,
                    status: Math.random() > 0.7 ? 'APROVADO' : 'EM_DESENVOLVIMENTO',
                    fase: 'EXECUTIVO',
                }
            });

            // Add 5 checklist items per discipline
            for (let i = 1; i <= 5; i++) {
                await prisma.checklistItem.create({
                    data: {
                        projectId: p.id,
                        disciplineId: disc.id,
                        tipo: 'DOCUMENTO_FASE',
                        descricao: `Checklist ${d.name} - Item ${i}`,
                        status: i % 2 === 0 ? 'APROVADO' : 'PENDENTE',
                        prazo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                    }
                });
            }
        }
    }

    console.log('✅ Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
