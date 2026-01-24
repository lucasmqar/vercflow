// VERCFLOW Core Types - Unified System

export type Role =
  // Nível 0 - Diretoria
  | 'CEO'
  | 'DIRETOR'

  // Nível 1 - Comercial
  | 'GERENTE_COMERCIAL'
  | 'CONSULTOR_COMERCIAL'

  // Nível 2 - Engenharia (Core)
  | 'COORD_ENGENHARIA'
  | 'ENGENHEIRO_OBRA'
  | 'MESTRE_OBRA'

  // Nível 3 - Projetos
  | 'COORD_PROJETOS'
  | 'ARQUITETO'
  | 'PROJETISTA'

  // Nível 3 - Apoio (Financeiro, Compras, RH, Logística)
  | 'GERENTE_FINANCEIRO'
  | 'GERENTE_COMPRAS'
  | 'COORD_RH'
  | 'COORD_LOGISTICA'

  // Nível 4 - Campo/Externo
  | 'ENCARREGADO'
  | 'PARCEIRO_EXTERNO'
  | 'CLIENTE_VIEW'
  | 'ADMIN'; // System Admin

export type Department =
  | 'DIRETORIA'
  | 'COMERCIAL'
  | 'ENGENHARIA'
  | 'PROJETOS'
  | 'FINANCEIRO'
  | 'COMPRAS'
  | 'RH_SST'
  | 'LOGISTICA'
  | 'DESIGN'
  | 'EXTERNO';

export type RecordStatus =
  | 'CAPTURE'
  | 'TRIAGE'
  | 'ANALYSIS'
  | 'DISTRIBUTION'
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
  department?: Department;
  ativo: boolean;
  avatar?: string;
}

export interface Client {
  id: string;
  nome: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  tipo: string;
  documento?: string;
  cnpj?: string;
  rgIe?: string;
  contatos?: string;
  email?: string;
  enderecoCompleto?: string;
  representacao?: string;
  configOrgaos?: string;
  logo?: string;
  nps?: number;
  saude?: 'Excelente' | 'Bom' | 'Alerta' | 'Novo';
  valorTotal?: number;
  contratos?: number;
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
  lat?: number;
  lng?: number;
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
  clientId?: string; // Optional if manual origin
  client?: Client;
  nomeValidacao?: string; // For manual entry without client ID
  nomeObra: string;
  localizacao: string;
  classificacao?: WorkClassification;
  areaEstimada?: number;
  tipoObra: string;
  origem?: string; // Added Origin
  contato?: string; // Added Contact
  status: 'NOVO' | 'EM_QUALIFICACAO' | 'QUALIFICADO' | 'PERDIDO' | 'CONVERTIDO';
  lat?: number;
  lng?: number;
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
  revisions?: BudgetRevision[];
  criadoEm: string;
}

export interface BudgetRevision {
  id: string;
  budgetId: string;
  version: number;
  escopoMacro: string;
  valorEstimado: number;
  prazoEstimadoMeses: number;
  responsavelId: string;
  resumoAlteracoes: string;
  createdAt: string;
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
  project?: Project;
  documentId?: string;
  nome: string;
  descricao?: string;
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
  | 'notifications' // Notificações do Sistema
  | 'config';      // Admin / Configurações

// ========== FASE 1: DP (DEPARTAMENTO PESSOAL) ==========

export interface Employee {
  id: string;
  userId?: string;
  nome: string;
  cpf: string;
  rg?: string;
  dataNascimento?: string;
  endereco?: string;
  contatos?: string; // JSON
  cargo: string;
  departamento: string;
  salario: number;
  dataAdmissao: string;
  dataDemissao?: string;
  statusAtual: 'ATIVO' | 'FERIAS' | 'AFASTADO' | 'DEMITIDO';
  motivoDemissao?: string;
  observacoes?: string;
  criadoEm: string;
  updatedAt: string;
  payrolls?: Payroll[];
  benefits?: EmployeeBenefit[];
  asos?: ASO[];
  accidents?: Accident[];
  epiDistributions?: EPIDistribution[];
  exitInterview?: ExitInterview;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employee?: Employee;
  mesReferencia: string;
  salarioBase: number;
  horasExtras?: number;
  bonificacoes?: number;
  descontos?: number;
  salarioLiquido: number;
  dataPagamento?: string;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  observacoes?: string;
  criadoEm: string;
}

export interface Benefit {
  id: string;
  nome: string;
  tipo: string;
  valor?: number;
  descricao?: string;
  criadoEm: string;
  employees?: EmployeeBenefit[];
}

export interface EmployeeBenefit {
  id: string;
  employeeId: string;
  employee?: Employee;
  benefitId: string;
  benefit?: Benefit;
  dataInicio: string;
  dataFim?: string;
  valorMensal?: number;
  criadoEm: string;
}

export interface ThirdPartyContract {
  id: string;
  empresa: string;
  cnpj: string;
  contato?: string;
  servico: string;
  valorMensal: number;
  dataInicio: string;
  dataFim?: string;
  status: 'ATIVO' | 'SUSPENSO' | 'ENCERRADO';
  observacoes?: string;
  criadoEm: string;
}

export interface ASO {
  id: string;
  employeeId: string;
  employee?: Employee;
  tipo: 'ADMISSIONAL' | 'PERIODICO' | 'RETORNO_FERIAS' | 'RETORNO_AFASTAMENTO' | 'DEMISSIONAL';
  dataExame: string;
  dataValidade?: string;
  medico: string;
  clinica?: string;
  resultado: 'APTO' | 'INAPTO' | 'APTO_COM_RESTRICOES';
  restricoes?: string;
  anexoUrl?: string;
  criadoEm: string;
}

export interface ExitInterview {
  id: string;
  employeeId: string;
  employee?: Employee;
  dataEntrevista: string;
  entrevistador: string;
  motivoSaida: 'VOLUNTARIO' | 'DEMISSAO_SEM_JUSTA_CAUSA' | 'JUSTA_CAUSA' | 'APOSENTADORIA';
  feedbackJson?: string;
  notaSatisfacao?: number;
  sugestoes?: string;
  voltaria?: boolean;
  criadoEm: string;
}

// ========== FASE 1: DST (SEGURANÇA DO TRABALHO) ==========

export interface SafetyInspection {
  id: string;
  projectId?: string;
  project?: Project;
  inspectorId: string;
  inspector?: User;
  dataInspecao: string;
  tipo: 'ROTINA' | 'ESPECIAL' | 'POS_ACIDENTE';
  checklistJson?: string;
  conformidades: number;
  naoConformidades: number;
  observacoes?: string;
  status: 'PENDENTE' | 'REGULARIZADO';
  criadoEm: string;
}

export interface Accident {
  id: string;
  employeeId: string;
  employee?: Employee;
  projectId?: string;
  project?: Project;
  dataOcorrencia: string;
  horaOcorrencia?: string;
  local: string;
  descricao: string;
  gravidade: 'LEVE' | 'MODERADO' | 'GRAVE' | 'FATAL';
  tipoAcidente: 'TIPICO' | 'TRAJETO' | 'DOENCA_OCUPACIONAL';
  partesCorpo?: string;
  testemunhas?: string;
  catEmitida: boolean;
  numeroCAT?: string;
  dataAfastamento?: string;
  diasAfastado?: number;
  investigacao?: string;
  medidasCorretivas?: string;
  status: 'ABERTO' | 'INVESTIGACAO' | 'FECHADO';
  criadoEm: string;
}

export interface EPIDistribution {
  id: string;
  employeeId: string;
  employee?: Employee;
  epiTipo: string;
  marca?: string;
  quantidade: number;
  dataEntrega: string;
  dataValidade?: string;
  nf?: string;
  assinaturaUrl?: string;
  status: 'EM_USO' | 'DEVOLVIDO' | 'DANIFICADO';
  observacoes?: string;
  criadoEm: string;
}

// ========== FASE 1: LOGÍSTICA (Complemento) ==========

export interface Tool {
  id: string;
  codigo: string;
  nome: string;
  tipo: string;
  marca?: string;
  estado: 'BOM' | 'REGULAR' | 'DANIFICADO';
  localizacao?: string;
  responsavel?: string;
  dataAquisicao?: string;
  valorAquisicao?: number;
  criadoEm: string;
  loans?: ToolLoan[];
}

export interface ToolLoan {
  id: string;
  toolId: string;
  tool?: Tool;
  usuarioId: string;
  usuario?: User;
  projectId?: string;
  project?: Project;
  dataSaida: string;
  dataRetorno?: string;
  estadoSaida: string;
  estadoRetorno?: string;
  observacoes?: string;
  criadoEm: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  tipo: 'PREVENTIVA' | 'CORRETIVA' | 'REVISAO';
  descricao: string;
  oficina?: string;
  valor?: number;
  dataExecucao: string;
  quilometragem?: number;
  proximaRevisao?: string;
  anexoUrl?: string;
  criadoEm: string;
}

// ========== LOGÍSTICA (Frotas & Estoque) ==========

export interface Vehicle {
  id: string;
  placa: string;
  modelo: string;
  tipo: string;
  status: 'ATIVO' | 'MANUTENCAO' | 'INATIVO';
  responsavelId?: string;
  responsavel?: User;
  criadoEm: string;
}

export interface StockMovement {
  id: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA';
  materialDescricao: string;
  quantidade: number;
  unidade: string;
  projectId?: string;
  project?: Project;
  userId: string;
  user?: User;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO';
  observacoes?: string;
  criadoEm: string;
}

