import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting SQLite Seed...');

    // 1. Clean data
    await prisma.auditLog.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.raciAssignment.deleteMany();
    await prisma.activityAssignment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.request.deleteMany();
    await prisma.discipline.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.document.deleteMany();
    await prisma.sketch.deleteMany();
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
    ];

    const createdUsers: any[] = [];
    for (const u of users) {
        const user = await prisma.user.create({ data: u });
        createdUsers.push(user);
    }
    console.log(`👤 ${createdUsers.length} Users created.`);

    // 3. Create Professionals
    const prosData = [
        { nome: 'Joaquim Engenheiro', tipo: 'INTERNO_ENGENHEIRO', userId: createdUsers.find(u => u.email === 'joaquim@vercflow.com').id },
        { nome: 'Beatriz Arquiteta', tipo: 'INTERNO_ARQUITETO', userId: createdUsers.find(u => u.email === 'beatriz@vercflow.com').id },
        { nome: 'Carlos Projetista', tipo: 'INTERNO_PROJETISTA', userId: createdUsers.find(u => u.email === 'carlos@vercflow.com').id },
        { nome: 'Marmoraria Silva', tipo: 'EXTERNO_MAO_OBRA', userId: createdUsers.find(u => u.email === 'silva@vercflow.com').id },
        { nome: 'Eletrica Volt', tipo: 'EXTERNO_MAO_OBRA', userId: createdUsers.find(u => u.email === 'volt@vercflow.com').id },
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
    ];

    const createdClients: any[] = [];
    for (const c of clients) {
        const client = await prisma.client.create({ data: c });
        createdClients.push(client);
    }
    console.log(`🏢 ${createdClients.length} Clients created.`);

    // 5. Create Projects
    const projects = [
        { nome: 'Edifício Sky', endereco: 'Av. Paulista, 1000', status: 'ATIVA', clientId: createdClients[0].id },
        { nome: 'Residencial Aurora', endereco: 'Rua das Flores, 50', status: 'ATIVA', clientId: createdClients[2].id },
        { nome: 'Complexo Alpha', endereco: 'Rodovia Castelo Branco, KM 20', status: 'ATIVA', clientId: createdClients[1].id },
        { nome: 'Loft Pinheiros', endereco: 'Rua Gilberto Sabino, 100', status: 'ATIVA', clientId: createdClients[0].id },
        { nome: 'Retrofit Alpha', endereco: 'Av. Brigadeiro, 200', status: 'ATIVA', clientId: createdClients[1].id },
    ];

    const createdProjects: any[] = [];
    for (const p of projects) {
        const project = await prisma.project.create({ data: p });
        createdProjects.push(project);
    }
    console.log(`🏗️ ${createdProjects.length} Projects (Obras) created.`);

    // 6. Create Records - 20 registros
    console.log('📝 Creating 20 Records...');
    for (let i = 1; i <= 20; i++) {
        const type = i <= 10 ? 'ESBOCO' : 'TEXTO';
        const author = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const project = createdProjects[Math.floor(Math.random() * createdProjects.length)];
        const status = i <= 5 ? 'RASCUNHO' : i <= 15 ? 'EM_TRIAGEM' : 'CLASSIFICADO';
        const prio = i % 4 === 0 ? 'CRITICA' : i % 3 === 0 ? 'ALTA' : 'MEDIA';

        const rec = await prisma.record.create({
            data: {
                authorId: author.id,
                projectId: project.id,
                texto: `Registro técnico #${i}: ${i % 2 === 0 ? 'Instalações' : 'Acabamentos'} - Área ${i % 5}`,
                type,
                status,
                prioridade: prio,
            }
        });

        if (type === 'ESBOCO') {
            await prisma.sketch.create({
                data: {
                    recordId: rec.id,
                    dataJson: JSON.stringify({ version: "5.3.0", objects: [] }),
                    imageUrl: 'data:image/png;base64,placeholder',
                }
            });
        }
    }

    // 7. Create Activities - 30 atividades
    console.log('🏃 Creating 30 Activities...');
    for (let i = 1; i <= 30; i++) {
        const project = createdProjects[Math.floor(Math.random() * createdProjects.length)];
        const statusOptions = ['PLANEJADO', 'EM_EXECUCAO', 'CONCLUIDO', 'BLOQUEADO'];
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        const prio = i % 5 === 0 ? 'CRITICA' : i % 3 === 0 ? 'ALTA' : 'MEDIA';

        const activity = await prisma.activity.create({
            data: {
                projectId: project.id,
                titulo: `Atividade #${i}: ${['Impermeabilização', 'Alvenaria', 'Pintura', 'Gesso', 'Elétrica'][i % 5]}`,
                descricao: `Escopo para execução da atividade #${i}`,
                status,
                prioridade: prio,
                dataInicio: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
                dataFim: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
            }
        });

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

    // 8. Create Disciplines
    console.log('📚 Creating Disciplines...');
    for (const p of createdProjects) {
        const disciplineNames = ['Arquitetura', 'Estrutura', 'Hidráulica'];
        for (const dName of disciplineNames) {
            const disc = await prisma.discipline.create({
                data: {
                    projectId: p.id,
                    name: dName,
                    category: 'PROJETO',
                    status: 'in_progress',
                    currentPhase: 'Executivo',
                }
            });

            // Add 3 tasks per discipline
            for (let i = 1; i <= 3; i++) {
                await prisma.task.create({
                    data: {
                        disciplineId: disc.id,
                        title: `Checklist ${dName} - Item ${i}`,
                        status: i % 2 === 0 ? 'completed' : 'todo',
                        priority: 'MEDIA',
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
