// Project Type Enums and Interfaces

export enum ProjectType {
    RESIDENCIAL_SIMPLES = 'RESIDENCIAL_SIMPLES',
    RESIDENCIAL_ALTO_PADRAO = 'RESIDENCIAL_ALTO_PADRAO',
    CONDOMINIO_RESIDENCIAL = 'CONDOMINIO_RESIDENCIAL',
    COMERCIAL_PEQUENO = 'COMERCIAL_PEQUENO',
    COMERCIAL_MEDIO = 'COMERCIAL_MEDIO',
    INDUSTRIAL_LEVE = 'INDUSTRIAL_LEVE',
    INDUSTRIAL_PESADO = 'INDUSTRIAL_PESADO',
    HOSPITALAR = 'HOSPITALAR',
    INSTITUCIONAL = 'INSTITUCIONAL',
    OBRA_ESPECIAL = 'OBRA_ESPECIAL',
}

export enum PipelineStage {
    LEAD = 'LEAD',
    ORCAMENTO = 'ORCAMENTO',
    PROPOSTA_GERADA = 'PROPOSTA_GERADA',
    PROPOSTA_ENVIADA = 'PROPOSTA_ENVIADA',
    PROPOSTA_FECHADA = 'PROPOSTA_FECHADA',
    CONTRATO_GERADO = 'CONTRATO_GERADO',
    CONTRATO_ASSINADO = 'CONTRATO_ASSINADO',
    MOBILIZACAO = 'MOBILIZACAO',
    EXECUCAO = 'EXECUCAO',
    ENTREGA = 'ENTREGA',
    POS_OBRA = 'POS_OBRA',
}

export enum DisciplineStatus {
    NAO_INICIADO = 'NAO_INICIADO',
    EM_PROGRESSO = 'EM_PROGRESSO',
    AGUARDANDO_ORGAO = 'AGUARDANDO_ORGAO',
    APROVADO = 'APROVADO',
    REPROVADO = 'REPROVADO',
    CONCLUIDO = 'CONCLUIDO',
}

export enum Department {
    COMERCIAL = 'COMERCIAL',
    ENGENHARIA = 'ENGENHARIA',
    JURIDICO = 'JURIDICO',
    FINANCEIRO = 'FINANCEIRO',
    COMPRAS = 'COMPRAS',
    RH_SST = 'RH_SST',
    LOGISTICA = 'LOGISTICA',
}

export enum TaskPriority {
    BAIXA = 'BAIXA',
    MEDIA = 'MEDIA',
    ALTA = 'ALTA',
    CRITICA = 'CRITICA',
}

export interface DisciplineNode {
    id: string
    code: string
    name: string
    category: string
    subcategory?: string
    isLeaf: boolean
    status: DisciplineStatus
    responsible?: string
    checklists: ChecklistItem[]
    documents: DocumentRequirement[]
    children?: DisciplineNode[]
}

export interface ChecklistItem {
    id: string
    description: string
    completed: boolean
    responsible?: string
    dueDate?: string
}

export interface DocumentRequirement {
    id: string
    name: string
    type: string
    required: boolean
    uploaded: boolean
    url?: string
}

export interface AutomatedTask {
    id: string
    title: string
    description: string
    department: Department
    priority: TaskPriority
    dueDate: string
    projectId: string
    disciplineId?: string
    pipelineStage: PipelineStage
    status: 'TODO' | 'IN_PROGRESS' | 'WAITING' | 'DONE'
    assignedTo?: string
}

export interface ProjectClassification {
    type: ProjectType
    purpose: string
    location: {
        city: string
        state: string
        zone: 'URBANA' | 'RURAL'
        isCondominium: boolean
    }
    area: number
    urgency: TaskPriority
    technicalParams: {
        floors: number
        hasMetalStructure: boolean
        hasPool: boolean
        hasAutomation: boolean
        hasClimate: boolean
        hasICU?: boolean // For hospitals
        hasSurgicalCenter?: boolean // For hospitals
        hasHeavyEquipment?: boolean // For industrial
        hasFoodProduction?: boolean // For commercial/industrial
        hasPublicAccess?: boolean // For commercial
    }
}

export interface ProjectPipeline {
    id: string
    projectId: string
    currentStage: PipelineStage
    stageHistory: {
        stage: PipelineStage
        enteredAt: string
        exitedAt?: string
        tasksGenerated: number
    }[]
    activeDisciplines: string[] // discipline IDs
    automatedTasks: AutomatedTask[]
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
    [ProjectType.RESIDENCIAL_SIMPLES]: 'Residencial Simples',
    [ProjectType.RESIDENCIAL_ALTO_PADRAO]: 'Residencial Alto Padrão',
    [ProjectType.CONDOMINIO_RESIDENCIAL]: 'Condomínio Residencial',
    [ProjectType.COMERCIAL_PEQUENO]: 'Comercial Pequeno Porte',
    [ProjectType.COMERCIAL_MEDIO]: 'Comercial Médio/Grande Porte',
    [ProjectType.INDUSTRIAL_LEVE]: 'Industrial Leve',
    [ProjectType.INDUSTRIAL_PESADO]: 'Industrial Pesado',
    [ProjectType.HOSPITALAR]: 'Hospitalar / Saúde',
    [ProjectType.INSTITUCIONAL]: 'Institucional / Público',
    [ProjectType.OBRA_ESPECIAL]: 'Obra Especial / Retrofit',
}

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
    [PipelineStage.LEAD]: 'Lead / Oportunidade',
    [PipelineStage.ORCAMENTO]: 'Orçamento',
    [PipelineStage.PROPOSTA_GERADA]: 'Proposta Gerada',
    [PipelineStage.PROPOSTA_ENVIADA]: 'Proposta Enviada',
    [PipelineStage.PROPOSTA_FECHADA]: 'Proposta Fechada',
    [PipelineStage.CONTRATO_GERADO]: 'Contrato Gerado',
    [PipelineStage.CONTRATO_ASSINADO]: 'Contrato Assinado',
    [PipelineStage.MOBILIZACAO]: 'Mobilização',
    [PipelineStage.EXECUCAO]: 'Execução',
    [PipelineStage.ENTREGA]: 'Entrega',
    [PipelineStage.POS_OBRA]: 'Pós-Obra',
}
