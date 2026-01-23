// VERCFLOW Core Types - Unified System

export type Role =
  | 'ADMIN'
  | 'CEO'
  | 'GESTOR'
  | 'TRIAGISTA'
  | 'OPERACIONAL'
  | 'PROFISSIONAL_INTERNO'
  | 'PROFISSIONAL_EXTERNO'
  | 'CLIENTE_VIEW';

export type RecordStatus =
  | 'REGISTRO'
  | 'TRIAGEM'
  | 'CLASSIFICACAO'
  | 'ORDENACAO'
  | 'VALIDACAO'
  | 'DISTRIBUICAO'
  | 'CONVERTIDO'
  | 'ARQUIVADO';

export type RecordType = 'TEXTO' | 'FOTO' | 'ESBOCO' | 'CHECKLIST';

export type ActivityStatus =
  | 'PLANEJADO'
  | 'EM_EXECUCAO'
  | 'CONCLUIDO'
  | 'BLOQUEADO'
  | 'CANCELADO';

export type Priority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: Role;
  ativo: boolean;
  avatar?: string;
}

export interface Client {
  id: string;
  nome: string;
  tipo: string;
  documento?: string;
  rgIe?: string;
  contatos?: string;
  enderecoCompleto?: string;
  representacao?: string;
  configOrgaos?: string;
  criadoEm: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'IMAGE' | 'PDF' | 'DOC' | 'OTHER';
  size: number;
  uploadedAt: string;
}

export interface WorkClassification {
  zona: 'URBANA' | 'RURAL' | 'MISTA_EXPANSAO';
  subzona?: 'VIA_PUBLICA' | 'CONDOMINIO_FECHADO' | 'LOTEAMENTO_ABERTO' | 'FAZENDA' | 'SITIO' | 'CHACARA' | 'RURAL_PRODUTIVA' | 'RURAL_INDUSTRIAL' | 'RURAL_EXPANSAO' | 'INSTITUCIONAL' | 'INDUSTRIAL_PLANEJADA';
  uso: 'HABITACAO_UNIFAMILIAR' | 'HABITACAO_MULTIFAMILIAR' | 'COMERCIAL_VAREJISTA' | 'SERVICOS' | 'INDUSTRIAL_LEVE' | 'INDUSTRIAL_PESADO' | 'SAUDE' | 'INSTITUCIONAL';
}

export interface Project {
  id: string;
  codigoInterno?: string;
  nome: string;
  endereco?: string;
  tipoObra?: string;
  constructionType?: string; // Added to fix type error
  classificacao?: WorkClassification;
  dadosLote?: string;
  areaConstruida?: number;
  area?: number; // Added to fix type error - likely alias for areaConstruida
  pavimentos?: number;
  exigenciasAprovacao?: string;
  status: 'ORCAMENTO' | 'NEGOCIACAO' | 'FECHADA' | 'ATIVA' | 'CONCLUIDA' | 'EM_PAUSA' | 'CANCELADA' | 'PLANEJAMENTO';
  categoria?: 'COMERCIAL' | 'INDUSTRIAL' | 'RESIDENCIAL' | 'HOSPITALAR' | 'CONDOMINIO' | 'EDIFICIO';
  clientId: string;
  client?: Client;
  mestreObraId?: string;
  engenheiroId?: string;
  orcamentoId?: string; // Link to the original commercial budget
  propostaId?: string;   // Link to the approved proposal
  attachments?: Attachment[];
  criadoEm: string;
  updatedAt: string;
  _count?: {
    activities: number;
    records: number;
  }
}

export interface Lead {
  id: string;
  clientId: string;
  client?: Client;
  nomeObra: string;
  localizacao: string;
  classificacao?: WorkClassification;
  areaEstimada?: number;
  tipoObra: string;
  status: 'NOVO' | 'EM_QUALIFICACAO' | 'QUALIFICADO' | 'PERDIDO' | 'CONVERTIDO';
  attachments?: Attachment[];
  criadoEm: string;
}

export interface Budget {
  id: string;
  leadId?: string;
  lead?: Lead;
  projectId?: string;
  project?: Project;
  escopoMacro: string;
  valorEstimado: number;
  prazoEstimadoMeses: number;
  status: 'EM_ELABORACAO' | 'AGUARDANDO_ENGENHARIA' | 'ENVIADO' | 'APROVADO' | 'REJEITADO'; // Added AGUARDANDO_ENGENHARIA
  criadoEm: string;
}

export interface Proposal {
  id: string;
  budgetId: string;
  budget?: Budget;
  versao: number;
  valorFinal: number;
  condicoesEspeciais?: string;
  status: 'PENDENTE' | 'NEGOCIACAO' | 'APROVADA' | 'RECUSADA' | 'FECHADA';
  dataValidade?: string;
  criadoEm: string;
}

export interface Record {
  id: string;
  refCodigo: string;
  authorId: string;
  author: User;
  projectId?: string;
  project?: Project;
  clientId?: string;
  texto?: string;
  type: RecordType;
  status: RecordStatus;
  prioridade: Priority;
  natureza?: string;
  responsavelValoresId?: string;
  responsavelValores?: User;
  parentId?: string;
  parent?: Partial<Record>;
  revisions?: Partial<Record>[];
  isInicial: boolean;
  items: RecordItem[];
  criadoEm: string;
  sketch?: Sketch;
  documents?: Document[];
}

export interface RecordItem {
  id: string;
  recordId: string;
  type: RecordType;
  content: string;
  order: number;
  checked?: boolean;
  criadoEm: string;
}

export interface Sketch {
  id: string;
  recordId: string;
  dataJson: string;
  imageUrl?: string;
  criadoEm: string;
}

export interface Document {
  id: string;
  recordId: string;
  tipo: string;
  pdfUrl?: string;
  status: string;
  versao: number;
  fees?: Fee[];
  criadoEm: string;
}

export interface Fee {
  id: string;
  projectId: string;
  documentId?: string;
  nome: string;
  valor: number;
  vencimento?: string;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  anexoUrl?: string;
  criadoEm: string;
}

export interface Activity {
  id: string;
  recordId?: string;
  record?: Record;
  projectId: string;
  project?: Project;
  titulo: string;
  descricao?: string;
  status: ActivityStatus;
  prioridade: Priority;
  dataInicio?: string;
  dataFim?: string;
  disciplineId?: string;
  discipline?: Discipline;
  assignments?: ActivityAssignment[];
  criadoEm: string;
}

export interface Professional {
  id: string;
  nome: string;
  tipo: string;
  documento?: string;
  contatos?: string;
  userId?: string;
  categories?: ProfessionalCategory[];
}

export interface ProfessionalCategory {
  id: string;
  professionalId: string;
  category: string;
  criadoEm: string;
}

export interface ActivityAssignment {
  id: string;
  activityId: string;
  professionalId: string;
  professional?: Professional;
  valorPrevisto: number;
  valorReal?: number;
  criadoEm: string;
}

// Legacy / Advanced Models
export interface Discipline {
  id: string;
  projectId: string;
  codigo: string;
  name: string;
  category: string;
  status: string;
  fase?: string;
  responsibleId?: string;
  responsible?: Professional;
  previsao?: string;
  entregaReal?: string;
  versaoAtual?: string;
}

export interface Task {
  id: string;
  disciplineId: string;
  title: string;
  status: string;
  priority: Priority;
  dueDate?: string;
}

export type DashboardTab =
  | 'home'         // Início
  | 'captura'      // Captura
  | 'triagem'      // Triagem (Restored)
  | 'comercial'    // Comercial
  | 'obras'        // Obras
  | 'projetos'     // Projetos
  | 'engenharia'   // Engenharia
  | 'financeiro'   // Financeiro
  | 'estoque'      // Compras & Estoque
  | 'rh-sst'       // RH / SST
  | 'logistica'    // Logística
  | 'design'       // Acabamentos & Design
  | 'config';      // Admin / Configurações
