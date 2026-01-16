// VERCFLOW Core Types - Linked to SQLite Schema

export type Role = 'ADMIN' | 'CEO' | 'GESTOR' | 'USUARIO_PADRAO' | 'EXTERNO';

export type RecordStatus = 'RASCUNHO' | 'EM_TRIAGEM' | 'CONVERTIDO' | 'ARQUIVADO';

export type RecordType = 'TEXTO' | 'FOTO' | 'ESBOCO';

export type ActivityStatus = 'PLANEJADO' | 'EM_EXECUCAO' | 'CONCLUIDO' | 'BLOQUEADO' | 'CANCELADO';

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
}

export interface Record {
  id: string;
  authorId: string;
  author: User;
  projectId?: string;
  project?: Project;
  clientId?: string;
  texto?: string;
  type: RecordType;
  status: RecordStatus;
  prioridade: Priority;
  criadoEm: string;
  sketch?: Sketch;
  documents?: Document[];
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
  tipo: string; // INTERNO, EXTERNO
  documento?: string;
  contatos?: string;
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

export type DashboardTab = 'captura' | 'triagem' | 'atividades' | 'obras' | 'equipe' | 'dashboard' | 'config' | 'clientes';
