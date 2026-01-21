import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const StrategicTypes = [
    'RESIDENCIAL_SIMPLES',
    'RESIDENCIAL_ALTO_PADRAO',
    'COMERCIAL',
    'INDUSTRIAL',
    'HOSPITALAR',
    'INSTITUCIONAL',
    'REFORMA',
    'ESPECIAL'
];

interface DisciplineDef {
    codigo: string;
    name: string;
    category: string;
    fase?: string;
}

export async function generateInitialChecklist(projectId: string, parameters: any) {
    console.log(`[Verc Intelligence] Expanding Ecosystem for Project ${projectId}...`);

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    const type = parameters.tipoObra || project?.tipoObra || 'RESIDENCIAL_ALTO_PADRAO';

    // 1. Dictionary of Potential Disciplines
    let disciplines: DisciplineDef[] = [
        { codigo: '1.1', name: 'Documentação & Legalização', category: 'ADMINISTRATIVO', fase: 'LEGAL' },
        { codigo: '2.1', name: 'Arquitetura - Estudo Preliminar', category: 'ARQUITETURA', fase: 'PRELIMINAR' },
        { codigo: '2.2', name: 'Arquitetura - Executivo', category: 'ARQUITETURA', fase: 'EXECUTIVO' },
    ];

    // Engineering Core - Structural
    if (parameters.estrutura === 'CONCRETO_ARMADO') {
        disciplines.push({ codigo: '3.1', name: 'Cálculo Estrutural (Concreto)', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
        disciplines.push({ codigo: '3.1.F', name: 'Plano de Formas & Escoramento', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
        disciplines.push({ codigo: '3.1.A', name: 'Detalhamento de Armação', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    } else if (parameters.estrutura === 'METALICA') {
        disciplines.push({ codigo: '3.2', name: 'Estrutura Metálica (Geral)', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
        disciplines.push({ codigo: '3.2.S', name: 'Projeto de Serralheria Estrutural', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    } else if (parameters.estrutura === 'ALVENARIA_ESTRUTURAL') {
        disciplines.push({ codigo: '3.3', name: 'Alvenaria Estrutural (Paginação)', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    } else {
        disciplines.push({ codigo: '3.x', name: 'Projetos Estruturais (Geral)', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    }

    // Engineering Core - MEP (Instalações)
    disciplines.push({ codigo: '4.1', name: 'Hidrossanitário (Água Fria/Quente)', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    disciplines.push({ codigo: '4.2', name: 'Esgotamento Sanitário', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    disciplines.push({ codigo: '4.3', name: 'Drenagem Pluvial (Águas de Chuva)', category: 'ENGENHARIA', fase: 'EXECUTIVO' });

    disciplines.push({ codigo: '5.1', name: 'Elétrico (Baixa Tensão)', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    disciplines.push({ codigo: '5.2', name: 'Luminotécnico & Disposição de Pontos', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    disciplines.push({ codigo: '6.1', name: 'Lógica, Wi-Fi & Telecom', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    disciplines.push({ codigo: '6.2', name: 'Segurança Eletrônica (CFTV/Alarme)', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    disciplines.push({ codigo: '5.3', name: 'Sistema de Proteção contra Descargas (SPDA)', category: 'ENGENHARIA', fase: 'EXECUTIVO' });

    // Gas Systems
    if (parameters.gas || ['HOSPITALAR', 'COMERCIAL', 'INDUSTRIAL'].includes(type)) {
        disciplines.push({ codigo: '7.x', name: 'Instalações de Gás (GLP/GN)', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    }

    // Special Requirements & Landscaping
    if (parameters.piscina) {
        disciplines.push({ codigo: '10.1', name: 'Piscina: Arquitetura & Impermeabilização', category: 'ARQUITETURA' });
        disciplines.push({ codigo: '10.2', name: 'Piscina: Filtros & Maquinário', category: 'ENGENHARIA' });
    }

    if (parameters.subsolo) {
        disciplines.push({ codigo: '3.S', name: 'Contenções (Muro de Arrimo/Paredão)', category: 'ENGENHARIA' });
        disciplines.push({ codigo: '4.S', name: 'Drenagem Especial de Subsolo', category: 'ENGENHARIA' });
    }

    if (parameters.paisagismo || ['RESIDENCIAL_ALTO_PADRAO', 'INSTITUCIONAL'].includes(type)) {
        disciplines.push({ codigo: '11.1', name: 'Projeto de Paisagismo & Vegetação', category: 'ARQUITETURA', fase: 'EXECUTIVO' });
        disciplines.push({ codigo: '11.2', name: 'Irrigação Automatizada', category: 'ENGENHARIA', fase: 'EXECUTIVO' });
    }

    if (parameters.climatizacao || ['HOSPITALAR', 'COMERCIAL', 'INDUSTRIAL'].includes(type)) {
        disciplines.push({ codigo: '8.1', name: 'Climatização (HVAC/VRF)', category: 'ENGENHARIA' });
        disciplines.push({ codigo: '8.2', name: 'Exaustão Mecânica', category: 'ENGENHARIA' });
    }

    if (parameters.corpoBombeiros || ['COMERCIAL', 'INDUSTRIAL', 'HOSPITALAR'].includes(type) || parameters.paineisSolares) {
        disciplines.push({ codigo: '7.1', name: 'Projeto de Combate a Incêndio (CBM)', category: 'ENGENHARIA' });
    }

    if (type === 'HOSPITALAR') {
        disciplines.push({ codigo: '9.1', name: 'Rede de Gases Medicinais', category: 'ENGENHARIA' });
        disciplines.push({ codigo: '9.2', name: 'Conforto Acústico Hospitalar', category: 'ENGENHARIA' });
        disciplines.push({ codigo: '15.1', name: 'Prognóstico de Vigilância Sanitária (VISA)', category: 'ADMINISTRATIVO' });
    }

    if (parameters.automacao) {
        disciplines.push({ codigo: '12.1', name: 'Automação Predial / Smart Home', category: 'ENGENHARIA' });
        disciplines.push({ codigo: '12.2', name: 'Sistema de Áudio & Vídeo Professional', category: 'ENGENHARIA' });
    }

    // Surveying (Levantamentos)
    if (parameters.sondagem || ['RESIDENCIAL_ALTO_PADRAO', 'INDUSTRIAL'].includes(type)) {
        disciplines.push({ codigo: '0.1', name: 'Levantamento Topográfico Planialtimétrico', category: 'ENGENHARIA', fase: 'PRELIMINAR' });
        disciplines.push({ codigo: '0.2', name: 'Sondagem de Solo (SPT)', category: 'ENGENHARIA', fase: 'PRELIMINAR' });
    }

    // 2. Database Sync
    // Clean up existing if any (avoid dupes on re-run)
    // await prisma.discipline.deleteMany({ where: { projectId } });

    for (const d of disciplines) {
        const discipline = await prisma.discipline.create({
            data: {
                projectId,
                codigo: d.codigo,
                name: d.name,
                category: d.category,
                fase: d.fase || null,
                status: 'NAO_CONTRATADO'
            }
        });

        // Add standard "Checklist de Início" for each discipline
        await prisma.checklistItem.create({
            data: {
                projectId,
                disciplineId: discipline.id,
                tipo: 'DOCUMENTO_FASE',
                descricao: `Kickoff: ${d.name}`,
                status: 'PENDENTE'
            }
        });

        // Create initial tasks/activities for PM Dashboard
        await prisma.activity.create({
            data: {
                projectId,
                disciplineId: discipline.id,
                titulo: `${d.codigo} | Definição: ${d.name}`,
                descricao: `Tarefa gerada pela Verc Intelligence para ativação do ecossistema ${type}.`,
                status: 'PLANEJADO',
                prioridade: parameters.urgencia || 'MEDIA'
            }
        });
    }

    // 3. Define Organs & Legal Checklists
    let organs: string[] = ['PREFEITURA'];
    if (parameters.condominio) organs.push('CONDOMINIO');
    if (type === 'HOSPITALAR' || parameters.vigilanciaSanitaria) organs.push('VISA');
    if (['COMERCIAL', 'INDUSTRIAL', 'HOSPITALAR'].includes(type) || parameters.corpoBombeiros) organs.push('BOMBEIROS');
    if (parameters.energia) organs.push('ENERGISA/EQUATORIAL');

    for (const organ of organs) {
        await prisma.checklistItem.create({
            data: {
                projectId,
                tipo: 'REQUISITO_LEGAL',
                descricao: `Aprovação Legal: ${organ}`,
                status: 'PENDENTE'
            }
        });
    }

    console.log(`[ChecklistEngine] Success: ${disciplines.length} disciplines and ${organs.length} legal items created.`);
    return { success: true, count: disciplines.length };
}
