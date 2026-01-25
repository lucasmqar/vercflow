// ==========================================
// VERCFLOW OBJECTIVE TAXONOMY - 2026 STRICT STANDARD
// ==========================================

// 1. NATUREZA PRINCIPAL (Tronco)
export const NATUREZAS_OBRA = [
    { id: 'RESIDENCIAL', label: 'Residencial', desc: 'Edificações para moradia unifamiliar ou coletiva.' },
    { id: 'COMERCIAL', label: 'Comercial / Serviços', desc: 'Varejo, escritórios, alimentação e serviços gerais.' },
    { id: 'INDUSTRIAL', label: 'Industrial / Logístico', desc: 'Produção, armazenagem e centros de distribuição.' },
    { id: 'HOSPITALAR', label: 'Hospitalar / Saúde', desc: 'Clínicas, centros cirúrgicos e laboratórios de alta complexidade.' },
    { id: 'INSTITUCIONAL', label: 'Institucional', desc: 'Educação, governo, cultura e templos religiosos.' },
    { id: 'INFRAESTRUTURA', label: 'Infraestrutura / Urbanismo', desc: 'Loteamentos, rodovias, pontes e saneamento.' },
    { id: 'LAZER', label: 'Lazer / Hospitality', desc: 'Hotéis, resorts, clubes e espaços recreativos.' }
] as const;

// 2. CONTEXTO E SUBCONTEXTO (Zona Territorial)
export const CONTEXTOS = {
    URBANA: [
        { id: 'RUA_ABERTA', label: 'Rua Aberta (Inserção em Malha Urbana Consolidada)' },
        { id: 'LOTEAMENTO', label: 'Loteamento / Bairro Planejado (Canteiro Novo)' },
        { id: 'CONDOMINIO_HORIZONTAL', label: 'Condomínio Horizontal Fechado (Residencial)' },
        { id: 'CONDOMINIO_VERTICAL', label: 'Condomínio Vertical (Área de Verticalização)' },
        { id: 'POLO_INDUSTRIAL', label: 'Polo Industrial / Distrito Empresarial' },
        { id: 'CENTRO_HISTORICO', label: 'Centro Histórico / Área Tombada' },
        { id: 'AEIS', label: 'Zonas de Especial Interesse Social (EHIS/AEIS)' }
    ],
    RURAL: [
        { id: 'AGROVILA', label: 'Agrovila / Núcleo Rural Centralizado' },
        { id: 'FAZENDA_PRODUCAO', label: 'Fazenda de Produção (Agronegócio)' },
        { id: 'CHACARA_LAZER', label: 'Chácara / Sítio de Recreio' },
        { id: 'AREA_REMOTO', label: 'Área de Acesso Restrito / Remota' },
        { id: 'RESERVA_AMBIENTAL', label: 'Entorno de Unidade de Conservação' }
    ],
    PERIURBANA: [
        { id: 'EXPANSAO_URBANA', label: 'Vetor de Expansão Urbana (Área de Transição)' },
        { id: 'DISTRITO_MISTO', label: 'Distrito Agroindustrial / Misto' },
        { id: 'FAIXA_DOMINIO', label: 'Faixa de Domínio de Rodovia (Logística)' },
        { id: 'ENTORNO_AEROPORTO', label: 'Zona Aeroportuária / Heliportos' }
    ],
    COSTEIRA: [
        { id: 'ORLA_MARITIMA', label: 'Orla Marítima / Primeira Quadra' },
        { id: 'RESERVA_MARINHA', label: 'Zona de Proteção de Mangue / Estuário' },
        { id: 'MARINA_PORTO', label: 'Área Portuária / Marinas' }
    ]
} as const;

// 3. TIPOLOGIA FÍSICA (Por Natureza)
export const TIPOLOGIAS = {
    RESIDENCIAL: [
        { id: 'CASA_TERREA', label: 'Mansão / Casa Térrea Unifamiliar' },
        { id: 'SOBRADO_ISOLADO', label: 'Sobrado Isolado (4 Fachadas)' },
        { id: 'GEMINADA', label: 'Casas Geminadas / Townhouses' },
        { id: 'EDIFICIO_H_MEDIO', label: 'Edifício Horizontal (até 4 pav)' },
        { id: 'TORRE_ALTA', label: 'Torre Residencial de Alto Gabarito' },
        { id: 'ESTUDIO_LOFT', label: 'Estúdios / Lofts Compactos' },
        { id: 'VILAGIO', label: 'Világio / Condomínio de Pequeno Porte' }
    ],
    COMERCIAL: [
        { id: 'LOJA_CONCEITO', label: 'Flagship / Loja de Conceito' },
        { id: 'OFFICE_PREMIUM', label: 'Lajes Corporativas / Office Premium' },
        { id: 'COWORKING', label: 'Espaço de Trabalho / Coworking' },
        { id: 'STREET_MALL', label: 'Street Mall / Centro de Conveniência' },
        { id: 'SHOPPING_CENTER', label: 'Shopping Center / Power Center' },
        { id: 'RESTAURANTE_GOURMET', label: 'Alta Gastronomia / Restaurante Gourmet' },
        { id: 'FAST_FOOD_DRIVE', label: 'Drive-Thru / Fast Food Padrão' },
        { id: 'POSTO_SERVICO', label: 'Posto de Combustíveis / Conveniência' }
    ],
    HOSPITALAR: [
        { id: 'CONSULTORIO_INDIV', label: 'Consultório Individual / Coworking Med' },
        { id: 'CLINICA_ESPECIALIZADA', label: 'Centro de Diagnóstico / Clínica Espec.' },
        { id: 'HOSPITAL_DIA', label: 'Day Hospital / Centro Cirúrgico Leve' },
        { id: 'HOSPITAL_GERAL', label: 'Hospital Geral de Alta Complexidade' },
        { id: 'LABORATORIO_CENTRAL', label: 'Laboratório Central / Bio-Indústria' },
        { id: 'PRONTO_SOCORRO', label: 'UPA / Unidade de Pronto Atendimento' }
    ],
    INDUSTRIAL: [
        { id: 'GALPAO_CROSSDOCK', label: 'Galpão Logístico Cross-Docking' },
        { id: 'SHELTER_STORAGE', label: 'Self Storage / Armazenagem Flex' },
        { id: 'FABRICA_ALIMENTOS', label: 'Indústria Alimentícia (Normas Rígidas)' },
        { id: 'MANUFATURA_LEVE', label: 'Manufatura Leve / Hightech' },
        { id: 'USINA_ENERGIA', label: 'Usina Fotovoltaica / Energética' },
        { id: 'DATA_CENTER', label: 'Data Center / Infrastrutura TI' }
    ],
    INSTITUCIONAL: [
        { id: 'CAMPUS_ED', label: 'Campus Educacional / Escola Infantil' },
        { id: 'CENTRO_CULTURAL', label: 'Museu / Centro Cultural / Teatro' },
        { id: 'TEMPLO_MODERNO', label: 'Auditório / Templo Religioso' },
        { id: 'ADM_PUBLICA', label: 'Câmara / Prefeitura / Fórum' },
        { id: 'QUARTEL', label: 'Segurança Pública / Quartel / Base' }
    ],
    INFRAESTRUTURA: [
        { id: 'LOTEAMENTO_RES', label: 'Loteamento Residencial Aberto' },
        { id: 'LOTEAMENTO_FECHADO', label: 'Condomínio de Lotes (Loteam. Fechado)' },
        { id: 'URBANISMO_PARQUE', label: 'Parque Urbano / Revitalização Central' },
        { id: 'ESTRADA_PRIVATE', label: 'Via Privada / Acesso Controlado' },
        { id: 'SANEAMENTO_ESTACAO', label: 'ETA / ETE / Estação Elevatória' }
    ],
    LAZER: [
        { id: 'HOTEL_DESIGN', label: 'Hotel Boutique / Design' },
        { id: 'RESORT_LAZER', label: 'Resort de Lazer / Clubes' },
        { id: 'POUSADA_ECU', label: 'Eco-Pousada / Glamping' },
        { id: 'CENTRO_ESPORTIVO', label: 'Arena Esportiva / Complexo de Beach Tennis' },
        { id: 'SALAO_EVENTOS', label: 'Espaço de Eventos / Buffet Premium' }
    ]
} as const;

// 4. PADRÃO E FINALIDADE
export const PADROES = [
    { id: 'ECONOMICO', label: 'Econômico / Popular (Habitação de Interesse Social)' },
    { id: 'MEDIO', label: 'Médio Padrão (Uso Padrão Mercado)' },
    { id: 'ALTO_PADRAO', label: 'Alto Padrão (Materiais Nobres / Tecnologia)' },
    { id: 'ALTO_LUXO', label: 'Alto Luxo / Singular (Exclusividade Total)' },
    { id: 'CORPORATIVO', label: 'Corporativo Standard' },
    { id: 'PREMIUM', label: 'Executive/Premium (High-End Trends)' }
] as const;

export const FINALIDADES = [
    { id: 'USO_PROPRIO', label: 'Uso Próprio (Ocupação Direta)' },
    { id: 'VENDA', label: 'Venda Imediata (Lucro sobre Construção)' },
    { id: 'RENDA', label: 'Renda Patrimonial (Locação/BTS)' },
    { id: 'MISTO', label: 'Uso Misto / Multifinalidade' }
] as const;

// 5. REGULARIZAÇÃO E LEGALIZAÇÃO
export const REGULARIZACAO = {
    OBJETOS: [
        { id: 'PROJETO_OBRA_NOVA', label: 'Projeto e execução de Obra Nova' },
        { id: 'REGULARIZACAO_EXISTENTE', label: 'Aprovação de obra já executada (Regularização)' },
        { id: 'AMPLIACAO', label: 'Ampliação de área construída' },
        { id: 'MUDANCA_USO', label: 'Mudança de Uso / Ocupação' },
        { id: 'INCENDIO', label: 'Prevenção e Combate a Incêndio (PPCI)' },
        { id: 'VIGILANCIA', label: 'Vigilância Sanitária (LTA/Alvará)' },
        { id: 'AMBIENTAL', label: 'Licenciamento Ambiental (LP/LI/LO)' },
        { id: 'ACESSIBILIDADE', label: 'Adequação de Acessibilidade (NBR 9050)' },
        { id: 'DEMOLICAO', label: 'Demolição / Desmonte' }
    ],
    ORGAOS: [
        { id: 'PREFEITURA', label: 'Prefeitura (Uso do Solo/Alvará)' },
        { id: 'BOMBEIROS', label: 'Corpo de Bombeiros (CERCON)' },
        { id: 'VISA', label: 'Vigilância Sanitária' },
        { id: 'AMBIENTAL_MUNICIPAL', label: 'Órgão Ambiental Mun.' },
        { id: 'AMBIENTAL_ESTADUAL', label: 'Órgão Ambiental Est. (SEMAD)' },
        { id: 'FEDERAL', label: 'Órgãos Federais (ANVISA/CNEN/IBAMA)' },
        { id: 'CONDOMINIO', label: 'Associação / Condomínio (ART/RRT)' }
    ],
    CENARIOS: [
        { id: 'NAO_INICIADA', label: 'A ser executada com aprovação prévia' },
        { id: 'ANDAMENTO', label: 'Em andamento (Regularizar durante obra)' },
        { id: 'EXECUTADA_SEM_DOC', label: 'Já executada sem documentação (Irregular)' },
        { id: 'COM_DOC_VENCIDA', label: 'Com documentação vencida / desatualizada' },
        { id: 'APENAS_ADEQUACAO', label: 'Adequação interna / Reforma (sem estrutural)' }
    ]
} as const;

// ENGINE: Recommendation Logic
import { WorkClassification } from '@/types';

export function getRecommendedDisciplines(classification: WorkClassification) {
    const recommended = new Set<string>();

    // BASE
    recommended.add('ARQ_LEGAL'); // Almost always needed if 'requerLegalizacao' is true, but logically strict
    recommended.add('ARQ_EXECUTIVO');

    // NATUREZA Rules
    if (classification.natureza === 'INDUSTRIAL') {
        recommended.add('EST_METALICA');
        recommended.add('PISO_INDUSTRIAL');
        recommended.add('SPDA');
    }
    if (classification.natureza === 'HOSPITALAR') {
        recommended.add('GASES_MEDICINAIS');
        recommended.add('CLIMATIZACAO_HOSP');
        recommended.add('RDC_50');
    }
    if (classification.natureza === 'COMERCIAL' && classification.tipologia === 'RESTAURANTE') {
        recommended.add('GAS_GLP');
        recommended.add('EXAUSTAO');
        recommended.add('GORDURA');
    }

    // PADRAO Rules
    if (['ALTO_PADRAO', 'ALTO_LUXO', 'PREMIUM'].includes(classification.padrao)) {
        recommended.add('INTERIORES');
        recommended.add('LUMINOTECNICO');
        recommended.add('AUTOMACAO');
        recommended.add('PAISAGISMO');
    }

    // REGULARIZACAO Rules
    if (classification.requerLegalizacao || (classification.objetos && classification.objetos.length > 0)) {
        if (classification.objetos?.includes('INCENDIO') || classification.legalizacao?.orgaos.includes('BOMBEIROS')) {
            recommended.add('PPCI');
        }
        if (classification.objetos?.includes('AMBIENTAL') || classification.legalizacao?.orgaos.includes('AMBIENTAL_ESTADUAL')) {
            recommended.add('LIC_AMBIENTAL');
            recommended.add('PGRS');
        }
        if (classification.objetos?.includes('REGULARIZACAO_EXISTENTE')) {
            recommended.add('LAUDO_ESTRUTURAL');
            recommended.add('AS_BUILT');
        }
    }

    return Array.from(recommended);
}
