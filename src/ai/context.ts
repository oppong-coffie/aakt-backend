import { BizInfra } from '../models/bizInfraModel';
import { BusinessDocument } from '../models/businessDocumentModel';
import { BusinessTask } from '../models/businessModel';
import { Folder } from '../models/folderModel';
import { Agent } from '../models/agentModel';
import { Onboarding } from '../models/onboardingModel';
import { Business, Phase, ProcessModel, Project } from '../models/portfolioModel';
import { Workload } from '../models/workloadModel';
import { WorkspaceContext } from './types';

const DEFAULT_LIMIT = 40;

function cleanDocument(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const doc = typeof (value as { toObject?: () => unknown }).toObject === 'function'
    ? (value as { toObject: () => unknown }).toObject()
    : value;

  if (!doc || typeof doc !== 'object') {
    return {};
  }

  const result = { ...(doc as Record<string, unknown>) };
  delete result.__v;
  return result;
}

function pickFields(
  value: unknown,
  fields: string[]
): Record<string, unknown> {
  const doc = cleanDocument(value);
  const picked: Record<string, unknown> = {};
  for (const field of fields) {
    if (doc[field] !== undefined) {
      picked[field] = doc[field];
    }
  }
  return picked;
}

export async function getWorkspaceContext(userId: string): Promise<WorkspaceContext> {
  const [
    onboarding,
    businesses,
    workloads,
    folders,
    bizInfraItems,
    projects,
    phases,
    processes,
  ] = await Promise.all([
    Onboarding.findOne({ userId }).lean(),
    Business.find({ userid: userId }).sort({ createdAt: -1 }).limit(DEFAULT_LIMIT),
    Workload.find({ userid: userId }).sort({ createdAt: -1 }).limit(DEFAULT_LIMIT),
    Folder.find({ userid: userId }).sort({ createdAt: -1 }).limit(DEFAULT_LIMIT),
    BizInfra.find({ userId }).sort({ createdAt: -1 }).limit(DEFAULT_LIMIT * 2),
    Project.find({ userid: userId }).sort({ createdAt: -1 }).limit(DEFAULT_LIMIT),
    Phase.find({ userid: userId }).sort({ createdAt: -1 }).limit(DEFAULT_LIMIT),
    ProcessModel.find({ userid: userId }).sort({ createdAt: -1 }).limit(DEFAULT_LIMIT),
  ]);

  const businessIds = businesses.map((business) => business._id.toString());
  const [businessTasks, businessDocuments, agents] = await Promise.all([
    BusinessTask.find({ businessId: { $in: businessIds } })
      .sort({ createdAt: -1 })
      .limit(DEFAULT_LIMIT),
    BusinessDocument.find({ businessId: { $in: businessIds } })
      .sort({ createdAt: -1 })
      .limit(DEFAULT_LIMIT),
    Agent.find({ businessId: { $in: businessIds } })
      .sort({ createdAt: -1 })
      .limit(DEFAULT_LIMIT),
  ]);

  const bizInfra: WorkspaceContext['bizInfra'] = {
    skillset: [],
    network: [],
    intel: [],
    capital: [],
    reach: [],
  };

  for (const item of bizInfraItems) {
    const category = item.category;
    if (bizInfra[category]) {
      bizInfra[category].push(
        pickFields(item, ['_id', 'category', 'name', 'description', 'imageUrl', 'createdAt'])
      );
    }
  }

  return {
    onboarding: onboarding ? cleanDocument(onboarding) : null,
    businesses: businesses.map((item) =>
      pickFields(item, [
        '_id',
        'businessName',
        'product',
        'customer',
        'goToMarket',
        'culture',
        'createdAt',
      ])
    ),
    workloads: workloads.map((item) =>
      pickFields(item, ['_id', 'workloadname', 'status', 'tasks', 'createdAt'])
    ),
    folders: folders.map((item) =>
      pickFields(item, ['_id', 'folderName', 'createdAt'])
    ),
    bizInfra,
    projects: projects.map((item) =>
      pickFields(item, [
        '_id',
        'businessId',
        'projectName',
        'projectDescription',
        'folderId',
        'createdAt',
      ])
    ),
    phases: phases.map((item) =>
      pickFields(item, ['_id', 'projectId', 'phaseName', 'phaseDescription', 'createdAt'])
    ),
    processes: processes.map((item) =>
      pickFields(item, [
        '_id',
        'businessId',
        'projectId',
        'phaseId',
        'processName',
        'documents',
        'createdAt',
      ])
    ),
    businessTasks: businessTasks.map((item) =>
      pickFields(item, ['_id', 'businessId', 'taskName', 'folderId', 'documents', 'createdAt'])
    ),
    businessDocuments: businessDocuments.map((item) =>
      pickFields(item, ['_id', 'businessId', 'name', 'url', 'folderId', 'createdAt'])
    ),
    agents: agents.map((item) =>
      pickFields(item, ['id', 'name', 'kind', 'title', 'email', 'timezone', 'businessId'])
    ),
  };
}

export function summarizeWorkspaceContext(context: WorkspaceContext): string {
  const counts = {
    businesses: context.businesses.length,
    workloads: context.workloads.length,
    folders: context.folders.length,
    projects: context.projects.length,
    phases: context.phases.length,
    processes: context.processes.length,
    businessTasks: context.businessTasks.length,
    businessDocuments: context.businessDocuments.length,
    agents: context.agents.length,
    bizInfraItems: Object.values(context.bizInfra).reduce(
      (total, items) => total + items.length,
      0
    ),
  };

  return JSON.stringify(
    {
      counts,
      onboarding: context.onboarding,
      recentBusinesses: context.businesses.slice(0, 10),
      recentWorkloads: context.workloads.slice(0, 10),
      recentProjects: context.projects.slice(0, 10),
      recentBizInfra: context.bizInfra,
    },
    null,
    2
  );
}
