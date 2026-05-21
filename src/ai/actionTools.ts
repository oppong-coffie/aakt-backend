import { randomUUID } from 'crypto';
import { BizInfra } from '../models/bizInfraModel';
import { BusinessDocument } from '../models/businessDocumentModel';
import { BusinessTask } from '../models/businessModel';
import { Folder } from '../models/folderModel';
import { Agent } from '../models/agentModel';
import { Business, Phase, ProcessModel, Project } from '../models/portfolioModel';
import { Workload } from '../models/workloadModel';
import { AgentActionDraft, AgentToolName } from './types';

const BIZINFRA_CATEGORIES = ['skillset', 'network', 'intel', 'capital', 'reach'] as const;

type WorkloadTaskDocument = {
  _id?: { toString(): string };
  status: string;
};

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function requireString(input: Record<string, unknown>, field: string): string {
  const value = asString(input[field]);
  if (!value) {
    throw new Error(`${field} is required.`);
  }
  return value;
}

function optionalString(input: Record<string, unknown>, field: string): string | undefined {
  return asString(input[field]) ?? undefined;
}

function sanitizeLinkedDocuments(value: unknown): Array<{ name: string; url: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .slice(0, 10)
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }
      const record = item as Record<string, unknown>;
      const name = asString(record.name);
      const url = asString(record.url);
      return name && url ? { name, url } : null;
    })
    .filter((item): item is { name: string; url: string } => Boolean(item));
}

function isBizInfraCategory(value: string): value is (typeof BIZINFRA_CATEGORIES)[number] {
  return BIZINFRA_CATEGORIES.includes(value as (typeof BIZINFRA_CATEGORIES)[number]);
}

async function ensureBusinessAccess(businessId: string, userId: string): Promise<void> {
  const business = await Business.findOne({ _id: businessId, userid: userId });
  if (!business) {
    throw new Error('Business not found or not accessible.');
  }
}

async function ensureProjectAccess(projectId: string, userId: string): Promise<void> {
  const project = await Project.findOne({ _id: projectId, userid: userId });
  if (!project) {
    throw new Error('Project not found or not accessible.');
  }
}

async function ensurePhaseAccess(phaseId: string, userId: string): Promise<void> {
  const phase = await Phase.findOne({ _id: phaseId, userid: userId });
  if (!phase) {
    throw new Error('Phase not found or not accessible.');
  }
}

function cleanResult(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object') {
    return {};
  }
  const doc = typeof (value as { toObject?: () => unknown }).toObject === 'function'
    ? (value as { toObject: () => unknown }).toObject()
    : value;
  const result = { ...(doc as Record<string, unknown>) };
  delete result.__v;
  return result;
}

export const TOOL_DESCRIPTIONS: Record<AgentToolName, string> = {
  create_agent: 'Create a human, AI, or software agent assigned to a business.',
  create_bizinfra_item: 'Create a skillset, network, intel, capital, or reach resource.',
  create_business_document: 'Attach a standalone document URL to a business.',
  create_business_task: 'Create a business task, optionally with document links.',
  create_folder: 'Create a portfolio folder.',
  create_phase: 'Create a phase inside a project.',
  create_process: 'Create a process inside a project phase.',
  create_project: 'Create a project under a business.',
  create_workload: 'Create a home workload column.',
  create_workload_task: 'Create a task inside a workload column.',
  update_workload_task_status: 'Set a workload task status to Todo or Completed.',
};

export function sanitizeActionDraft(action: AgentActionDraft): AgentActionDraft | null {
  if (!TOOL_DESCRIPTIONS[action.toolName]) {
    return null;
  }

  return {
    toolName: action.toolName,
    title: asString(action.title) ?? TOOL_DESCRIPTIONS[action.toolName],
    description: asString(action.description) ?? TOOL_DESCRIPTIONS[action.toolName],
    input: action.input && typeof action.input === 'object' && !Array.isArray(action.input)
      ? action.input
      : {},
  };
}

export async function executeAgentAction(
  toolName: AgentToolName,
  input: Record<string, unknown>,
  userId: string
): Promise<Record<string, unknown>> {
  switch (toolName) {
    case 'create_agent': {
      const businessId = requireString(input, 'businessId');
      await ensureBusinessAccess(businessId, userId);
      const kind = requireString(input, 'kind');
      if (!['human', 'ai', 'software'].includes(kind)) {
        throw new Error('kind must be human, ai, or software.');
      }
      const agent = await Agent.create({
        id: optionalString(input, 'id') ?? randomUUID(),
        name: requireString(input, 'name'),
        kind,
        title: requireString(input, 'title'),
        email: requireString(input, 'email'),
        timezone: optionalString(input, 'timezone') ?? 'UTC',
        businessId,
      });
      return { type: 'agent', data: cleanResult(agent) };
    }

    case 'create_workload': {
      const workload = await Workload.create({
        userid: userId,
        workloadname: requireString(input, 'workloadname'),
        status: optionalString(input, 'status') ?? 'Pending',
        tasks: [],
      });
      return { type: 'workload', data: cleanResult(workload) };
    }

    case 'create_workload_task': {
      const workloadId = requireString(input, 'workloadId');
      const workload = await Workload.findOne({ _id: workloadId, userid: userId });
      if (!workload) {
        throw new Error('Workload not found or not accessible.');
      }
      workload.tasks.push({
        taskname: requireString(input, 'taskname'),
        status: optionalString(input, 'status') ?? 'Todo',
      });
      await workload.save();
      return { type: 'workload', data: cleanResult(workload) };
    }

    case 'update_workload_task_status': {
      const workloadId = requireString(input, 'workloadId');
      const taskId = requireString(input, 'taskId');
      const status = requireString(input, 'status');
      if (!['Todo', 'Completed'].includes(status)) {
        throw new Error('status must be Todo or Completed.');
      }
      const workload = await Workload.findOne({ _id: workloadId, userid: userId });
      if (!workload) {
        throw new Error('Workload not found or not accessible.');
      }
      const task = (workload.tasks as WorkloadTaskDocument[]).find(
        (item) => item._id?.toString() === taskId
      );
      if (!task) {
        throw new Error('Task not found in workload.');
      }
      task.status = status;
      await workload.save();
      return { type: 'workload', data: cleanResult(workload) };
    }

    case 'create_folder': {
      const folder = await Folder.create({
        folderName: requireString(input, 'folderName'),
        userid: userId,
      });
      return { type: 'folder', data: cleanResult(folder) };
    }

    case 'create_project': {
      const businessId = requireString(input, 'businessId');
      await ensureBusinessAccess(businessId, userId);
      const project = await Project.create({
        businessId,
        projectName: requireString(input, 'projectName'),
        projectDescription: optionalString(input, 'projectDescription'),
        folderId: optionalString(input, 'folderId'),
        userid: userId,
      });
      return { type: 'project', data: cleanResult(project) };
    }

    case 'create_phase': {
      const projectId = requireString(input, 'projectId');
      await ensureProjectAccess(projectId, userId);
      const phase = await Phase.create({
        projectId,
        phaseName: requireString(input, 'phaseName'),
        phaseDescription: optionalString(input, 'phaseDescription'),
        userid: userId,
      });
      return { type: 'phase', data: cleanResult(phase) };
    }

    case 'create_process': {
      const businessId = requireString(input, 'businessId');
      const projectId = requireString(input, 'projectId');
      const phaseId = requireString(input, 'phaseId');
      await Promise.all([
        ensureBusinessAccess(businessId, userId),
        ensureProjectAccess(projectId, userId),
        ensurePhaseAccess(phaseId, userId),
      ]);
      const process = await ProcessModel.create({
        businessId,
        projectId,
        phaseId,
        processName: requireString(input, 'processName'),
        documents: [],
        userid: userId,
      });
      return { type: 'process', data: cleanResult(process) };
    }

    case 'create_business_task': {
      const businessId = requireString(input, 'businessId');
      await ensureBusinessAccess(businessId, userId);
      const task = await BusinessTask.create({
        businessId,
        taskName: requireString(input, 'taskName'),
        folderId: optionalString(input, 'folderId'),
        documents: sanitizeLinkedDocuments(input.documents),
      });
      return { type: 'businessTask', data: cleanResult(task) };
    }

    case 'create_business_document': {
      const businessId = requireString(input, 'businessId');
      await ensureBusinessAccess(businessId, userId);
      const document = await BusinessDocument.create({
        businessId,
        name: requireString(input, 'name'),
        url: requireString(input, 'url'),
        folderId: optionalString(input, 'folderId'),
      });
      return { type: 'businessDocument', data: cleanResult(document) };
    }

    case 'create_bizinfra_item': {
      const category = requireString(input, 'category');
      if (!isBizInfraCategory(category)) {
        throw new Error(`category must be one of ${BIZINFRA_CATEGORIES.join(', ')}.`);
      }
      const item = await BizInfra.create({
        userId,
        category,
        name: requireString(input, 'name'),
        description: optionalString(input, 'description'),
        imageUrl: optionalString(input, 'imageUrl'),
      });
      return { type: 'bizInfraItem', data: cleanResult(item) };
    }

    default:
      throw new Error(`Unsupported action: ${toolName}`);
  }
}
