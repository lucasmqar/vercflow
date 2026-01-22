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

export interface Project {
  id: string;
  codigoInterno?: string;
  nome: string;
  endereco?: string;
  tipoObra?: string;
  dadosLote?: string;
  areaConstruida?: number;
  pavimentos?: number;
  exigenciasAprovacao?: string;
  status: 'ORCAMENTO' | 'NEGOCIACAO' | 'FECHADA' | 'ATIVA' | 'CONCLUIDA' | 'EM_PAUSA' | 'CANCELADA';
  categoria?: 'COMERCIAL' | 'INDUSTRIAL' | 'RESIDENCIAL' | 'HOSPITALAR' | 'CONDOMINIO' | 'EDIFICIO';
  clientId: string;
  client?: Client;
  mestreObraId?: string;
  engenheiroId?: string;
  orcamentoId?: string; // Link to the original commercial budget
  propostaId?: string;   // Link to the approved proposal
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
  areaEstimada?: number;
  tipoObra: string;
  status: 'NOVO' | 'EM_QUALIFICACAO' | 'QUALIFICADO' | 'PERDIDO' | 'CONVERTIDO';
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
  status: 'EM_ELABORACAO' | 'ENVIADO' | 'APROVADO' | 'REJEITADO';
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
  | 'home'         // Geral (Home + Resumo)
  | 'comercial'    // Comercial (Leads + Clientes)
  | 'obras'        // Obras
  | 'captura'      // Captura
  | 'triagem'      // Triagem
  | 'projetos'     // Projetos (Board + Disciplinas)
  | 'engenharia'   // Engenharia (Core + Site Controls + Assets)
  | 'estoque'      // Estoque (Stock + Purchases)
  | 'frota'        // Frota
  | 'financeiro'   // Financeiro (Cashflow + Propostas)
  | 'equipe'       // Equipe (Pessoas)
  | 'config';      // Ajustes
