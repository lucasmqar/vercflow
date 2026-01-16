import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // 1. Clean data
    await prisma.auditLog.deleteMany();
    await prisma.activityAssignment.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.document.deleteMany();
    await prisma.sketch.deleteMany();
    await prisma.record.deleteMany();
    await prisma.project.deleteMany();
    await prisma.client.deleteMany();
    await prisma.professional.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create Users
    const admin = await prisma.user.create({
        data: {
            nome: 'Admin Vercflow',
            email: 'admin@vercflow.com',
            senhaHash: 'admin123',
            role: 'ADMIN',
        },
    });

    const ceo = await prisma.user.create({
        data: {
            nome: 'Lucas CEO',
            email: 'lucas@vercflow.com',
            senhaHash: 'ceo123',
            role: 'CEO',
        },
    });

    const gestor = await prisma.user.create({
        data: {
            nome: 'Marcos Gestor',
            email: 'marcos@vercflow.com',
            senhaHash: 'gestor123',
            role: 'GESTOR',
        },
    });

    const campo = await prisma.user.create({
        data: {
            nome: 'Operador de Campo',
            email: 'campo@vercflow.com',
            senhaHash: 'campo123',
            role: 'USUARIO_PADRAO',
        },
    });

    const externo = await prisma.user.create({
        data: {
            nome: 'Prestador Externo',
            email: 'parceiro@vercflow.com',
            senhaHash: 'parceiro123',
            role: 'EXTERNO',
        },
    });

    // 3. Create Clients
    const clientA = await prisma.client.create({
        data: {
            nome: 'Construtora Horizonte',
            documento: '12.345.678/0001-90',
            contatos: 'contato@horizonte.com',
        },
    });

    // 4. Create Projects (Obras)
    const project1 = await prisma.project.create({
        data: {
            nome: 'Edifício Sky',
            endereco: 'Av. Paulista, 1000',
            clientId: clientA.id,
        },
    });

    const project2 = await prisma.project.create({
        data: {
            nome: 'Residencial Aurora',
            endereco: 'Rua das Flores, 50',
            clientId: clientA.id,
        },
    });

    // 5. Create Professionals
    const prof1 = await prisma.professional.create({
        data: {
            nome: 'Joaquim Engenheiro',
            tipo: 'INTERNO',
            documento: '123.456.789-00',
        },
    });

    const prof2 = await prisma.professional.create({
        data: {
            nome: 'Marmoraria Silva',
            tipo: 'EXTERNO',
            documento: '98.765.432/0001-11',
        },
    });

    // 6. Create initial records (Capture)
    const rec1 = await prisma.record.create({
        data: {
            authorId: ceo.id,
            projectId: project1.id,
            texto: 'Verificar infiltração no 12º andar. Parece vir da laje técnica.',
            type: 'TEXTO',
            status: 'EM_TRIAGEM',
            prioridade: 'ALTA',
        },
    });

    const rec2 = await prisma.record.create({
        data: {
            authorId: gestor.id,
            projectId: project2.id,
            texto: 'Esboço inicial da nova fachada frontal.',
            type: 'ESBOCO',
            status: 'RASCUNHO',
            prioridade: 'MEDIA',
        },
    });

    // 7. Create Sketch for rec2
    await prisma.sketch.create({
        data: {
            recordId: rec2.id,
            dataJson: JSON.stringify({ version: "5.3.0", objects: [] }),
            imageUrl: 'base64_placeholder',
        },
    });

    // 8. Create Activity from rec1
    const activity1 = await prisma.activity.create({
        data: {
            recordId: rec1.id,
            projectId: project1.id,
            titulo: 'Reparar Infiltração 12º Andar',
            descricao: 'Realizar teste de estanqueidade e trocar manta se necessário.',
            status: 'PLANEJADO',
            prioridade: 'CRITICA',
            dataInicio: new Date(),
            dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    // 9. Assign Professional
    await prisma.activityAssignment.create({
        data: {
            activityId: activity1.id,
            professionalId: prof1.id,
            valorPrevisto: 1500.0,
        },
    });

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
