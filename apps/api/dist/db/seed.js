import { PrismaClient, UserRole, ObraStatus, RegistroStatus, RegistroType, Priority, ProfissionalStatus, InsumoStatus } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('Seed started...');
    // 1. Create Default User
    const user = await prisma.user.upsert({
        where: { email: 'carlos@verc.com' },
        update: {},
        create: {
            email: 'carlos@verc.com',
            name: 'Carlos Silva',
            role: UserRole.MANAGER,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        },
    });
    // 2. Create Obras
    const obra1 = await prisma.obra.create({
        data: {
            name: 'Edifício Aurora Tower',
            client: 'Construtora Horizonte',
            location: 'São Paulo, SP',
            status: ObraStatus.ACTIVE,
            progress: 67,
            startDate: new Date('2024-01-15'),
            estimatedEnd: new Date('2025-06-30'),
        },
    });
    const obra2 = await prisma.obra.create({
        data: {
            name: 'Residencial Villa Verde',
            client: 'Incorporadora Sustenta',
            location: 'Campinas, SP',
            status: ObraStatus.ACTIVE,
            progress: 34,
            startDate: new Date('2024-06-01'),
            estimatedEnd: new Date('2025-12-15'),
        },
    });
    // 3. Create Profissionais
    const prof1 = await prisma.profissional.create({
        data: {
            name: 'João Pereira',
            role: 'Engenheiro Civil',
            company: 'VERC Engenharia',
            email: 'joao@verc.com',
            phone: '(11) 99999-1111',
            competencies: ['Estrutural', 'Fundações', 'Projeto'],
            status: ProfissionalStatus.AVAILABLE,
            rating: 4.8,
            completedTasks: 156,
        },
    });
    // 4. Create Registros
    await prisma.registro.create({
        data: {
            title: 'Verificação estrutural do 12º andar',
            description: 'Realizada inspeção visual das vigas e pilares. Identificadas pequenas fissuras na laje.',
            authorId: user.id,
            obraId: obra1.id,
            status: RegistroStatus.PENDING,
            type: RegistroType.SKETCH,
            priority: Priority.HIGH,
            tags: ['estrutural', 'inspeção', 'urgente'],
            hasSketch: true,
            requiresSignature: true,
        },
    });
    // 5. Create Insumos
    await prisma.insumo.createMany({
        data: [
            { name: 'Cimento CP-II', category: 'Materiais Básicos', unit: 'saco 50kg', quantity: 450, minQuantity: 200, status: InsumoStatus.AVAILABLE },
            { name: 'Aço CA-50 10mm', category: 'Ferragens', unit: 'barra 12m', quantity: 180, minQuantity: 100, status: InsumoStatus.AVAILABLE },
            { name: 'Areia Média', category: 'Agregados', unit: 'm³', quantity: 45, minQuantity: 50, status: InsumoStatus.LOW },
        ],
    });
    console.log('Seed finished successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
