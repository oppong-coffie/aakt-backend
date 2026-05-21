export type AgentToolName =
  | 'create_agent'
  | 'create_bizinfra_item'
  | 'create_business_document'
  | 'create_business_task'
  | 'create_folder'
  | 'create_phase'
  | 'create_process'
  | 'create_project'
  | 'create_workload'
  | 'create_workload_task'
  | 'update_workload_task_status';

export interface AgentActionDraft {
  toolName: AgentToolName;
  title: string;
  description: string;
  input: Record<string, unknown>;
}

export interface AgentChatRequest {
  conversationId?: string;
  message: string;
  scope?: {
    businessId?: string;
    currentPath?: string;
    folderId?: string;
    projectId?: string;
    workloadId?: string;
  };
}

export interface AgentChatResult {
  answer: string;
  conversationId: string;
  actions: Array<AgentActionDraft & { actionId: string; status: 'pending' }>;
}

export interface WorkspaceContext {
  onboarding: Record<string, unknown> | null;
  businesses: Array<Record<string, unknown>>;
  workloads: Array<Record<string, unknown>>;
  folders: Array<Record<string, unknown>>;
  bizInfra: Record<string, Array<Record<string, unknown>>>;
  projects: Array<Record<string, unknown>>;
  phases: Array<Record<string, unknown>>;
  processes: Array<Record<string, unknown>>;
  businessTasks: Array<Record<string, unknown>>;
  businessDocuments: Array<Record<string, unknown>>;
  agents: Array<Record<string, unknown>>;
}
