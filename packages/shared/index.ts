// VERCFLOW Core Types

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'engineer' | 'professional';
}

export interface Obra {
  id: string;
  name: string;
  client: string;
  location: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  startDate: string;
  estimatedEnd: string;
  thumbnail?: string;
}

export interface Registro {
  id: string;
  title: string;
  description: string;
  obraId: string;
  obraName: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'triaged' | 'in_progress' | 'completed';
  type: 'note' | 'sketch' | 'photo' | 'document';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  hasSketch: boolean;
  hasDocument: boolean;
  requiresSignature: boolean;
  thumbnail?: string;
}

export interface Profissional {
  id: string;
  name: string;
  role: string;
  company?: string;
  email: string;
  phone: string;
  competencies: string[];
  status: 'available' | 'busy' | 'inactive';
  rating: number;
  completedTasks: number;
}

export interface Insumo {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  status: 'available' | 'low' | 'out_of_stock';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo?: Profissional;
  obraId: string;
  registroId?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  createdAt: string;
}

export interface Documento {
  id: string;
  title: string;
  type: 'contract' | 'report' | 'certificate' | 'sketch' | 'other';
  obraId: string;
  createdAt: string;
  status: 'draft' | 'pending_signature' | 'signed' | 'archived';
  signatures: Signature[];
  fileUrl?: string;
}

export interface Signature {
  userId: string;
  userName: string;
  signedAt: string;
  signatureImage?: string;
}

export interface ProcessoLegal {
  id: string;
  title: string;
  type: string;
  obraId: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  dueDate?: string;
}

export type DashboardTab = 'inbox' | 'triagem' | 'obras' | 'profissionais' | 'insumos' | 'documentos' | 'processos';
