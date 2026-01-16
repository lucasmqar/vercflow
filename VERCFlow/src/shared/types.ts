export interface User {
  id: number;
  mocha_user_id: string;
  name: string;
  email: string;
  cargo: string;
  photo_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  client_name: string | null;
  project_type: string | null;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface Discipline {
  id: number;
  project_id: number;
  category: string;
  name: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'in_review' | 'approved' | 'sent_to_authority' | 'awaiting_response' | 'completed';
  current_phase: string | null;
  subcategory: string | null;
  icon: string | null;
  color: string | null;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  discipline_id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'in_review' | 'approved' | 'completed';
  category: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent' | null;
  due_date: string | null;
  completed_at: string | null;
  assigned_to: number | null;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface RaciAssignment {
  id: number;
  entity_type: 'project' | 'discipline' | 'task' | 'request';
  entity_id: number;
  user_id: number;
  role: 'responsible' | 'accountable' | 'consulted' | 'informed';
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  entity_type: 'project' | 'discipline' | 'task' | 'request';
  entity_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Request {
  id: number;
  project_id: number;
  discipline_id: number | null;
  type: string;
  category: string | null;
  subcategory: string | null;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent' | null;
  requested_by: number;
  assigned_to: number | null;
  due_date: string | null;
  cancellation_reason: string | null;
  cancelled_by: number | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  projectsActive: number;
  projectsCompleted: number;
  totalDisciplines: number;
  tasksPending: number;
  tasksCompleted: number;
  requestsOpen: number;
  requestsUrgent: number;
}
