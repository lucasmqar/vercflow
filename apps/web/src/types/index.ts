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
  documento?: string;
  contatos?: string;
}

export interface Project {
  id: string;
  nome: string;
  endereco?: string;
  status: string;
  clientId: string;
  client?: Client;
  _count?: {
    activities: number;
    records: number;
  }
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
  name: string;
  category: string;
  status: string;
  currentPhase?: string;
  icon?: string;
  color?: string;
  tasks?: Task[];
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
  | 'captura'
  | 'triagem'
  | 'atividades'
  | 'obras'
  | 'equipe'
  | 'dashboard'
  | 'config'
  | 'clientes'
  | 'disciplinas';
