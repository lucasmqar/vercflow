export type Role = 'ADMIN' | 'GESTOR' | 'PLANEJADOR' | 'INTERNO' | 'EXTERNO';

export type ObraStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export type RegistroStatus = 'DRAFT' | 'SENT_TO_TRIAGE' | 'PROCESSING' | 'CONVERTED' | 'ARCHIVED';

export type RegistroType = 'NOTE' | 'SKETCH' | 'INSPECTION' | 'INCIDENT';

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'BLOCKED' | 'WAITING_APPROVAL' | 'COMPLETED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface Client {
    id: string;
    name: string;
    document?: string;
    contact?: string;
    email?: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Obra {
    id: string;
    code: string;
    name: string;
    address: string;
    status: ObraStatus;
    clientId?: string;
    client?: Client;
    createdAt: Date;
    updatedAt: Date;
}

export interface Profissional {
    id: string;
    name: string;
    document?: string;
    specialty: string;
    contact?: string;
    active: Boolean;
    obraId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Registro {
    id: string;
    code?: string;
    title: string;
    description?: string;
    type: RegistroType;
    status: RegistroStatus;
    priority: Priority;
    tags: string[];

    authorId: string;
    author?: User;

    obraId?: string;
    obra?: Obra;

    clientId?: string;
    client?: Client;

    profissionalId?: string;
    profissional?: Profissional;

    relatedTaskId?: string;
    relatedOsId?: string;

    sketch?: Sketch;
    documents?: Document[];

    createdAt: Date;
    updatedAt: Date;
}

export interface Sketch {
    id: string;
    jsonData: any;
    pngUrl?: string;
    registroId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    dueDate?: Date;
    obraId: string;
    assigneeId?: string;
    profissionalId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServiceOrder {
    id: string;
    code: string;
    description: string;
    status: TaskStatus;
    startDate?: Date;
    endDate?: Date;
    obraId: string;
    profissionalId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface LegalProcess {
    id: string;
    code?: string;
    type: string;
    description?: string;
    organ?: string;
    deadline?: Date;
    status: string;
    obraId?: string;
    clientId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Document {
    id: string;
    title: string;
    type: string;
    url: string;
    version: number;
    registroId?: string;
    osId?: string;
    processId?: string;
    createdAt: Date;
    updatedAt: Date;
}
