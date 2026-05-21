import { randomUUID } from 'crypto';
import { AgentAction } from '../models/agentActionModel';
import { AgentConversation } from '../models/agentConversationModel';
import { sanitizeActionDraft, TOOL_DESCRIPTIONS, TOOL_INPUT_CONTRACTS } from './actionTools';
import { getWorkspaceContext, summarizeWorkspaceContext } from './context';
import { generateModelText, isAiConfigured } from './modelProvider';
import { buildAgentSystemPrompt } from './prompts';
import {
  AgentActionDraft,
  AgentChatRequest,
  AgentChatResult,
  AgentToolName,
  WorkspaceContext,
} from './types';

interface ModelAgentOutput {
  answer?: string;
  proposedActions?: AgentActionDraft[];
}

const MAX_HISTORY_MESSAGES = 8;
const PLACEHOLDER_ID_MARKERS = new Set([
  'created',
  'n/a',
  'newly',
  'null',
  'placeholder',
  'tbd',
  'todo',
  'undefined',
  'unknown',
]);

function toolContractForPrompt(): string {
  return Object.entries(TOOL_DESCRIPTIONS)
    .map(
      ([name, description]) =>
        `- ${name}: ${description}\n  input: ${TOOL_INPUT_CONTRACTS[name as AgentToolName]}`
    )
    .join('\n');
}

function actionReferenceForPrompt(context: WorkspaceContext): Record<string, unknown> {
  return {
    businesses: context.businesses.map((business) => ({
      id: business._id,
      name: business.businessName,
    })),
    folders: context.folders.map((folder) => ({
      id: folder._id,
      name: folder.folderName,
    })),
    projects: context.projects.map((project) => ({
      id: project._id,
      name: project.projectName,
      businessId: project.businessId,
    })),
    phases: context.phases.map((phase) => ({
      id: phase._id,
      name: phase.phaseName,
      projectId: phase.projectId,
    })),
    processes: context.processes.map((process) => ({
      id: process._id,
      name: process.processName,
      businessId: process.businessId,
      projectId: process.projectId,
      phaseId: process.phaseId,
    })),
    businessTasks: context.businessTasks.map((task) => ({
      id: task._id,
      name: task.taskName,
      businessId: task.businessId,
      folderId: task.folderId,
    })),
    businessDocuments: context.businessDocuments.map((document) => ({
      id: document._id,
      name: document.name,
      businessId: document.businessId,
      folderId: document.folderId,
      url: document.url,
    })),
    agents: context.agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      kind: agent.kind,
      businessId: agent.businessId,
    })),
    bizInfra: context.bizInfra,
    workloads: context.workloads.map((workload) => ({
      id: workload._id,
      name: workload.workloadname,
      status: workload.status,
      tasks: Array.isArray(workload.tasks)
        ? workload.tasks.map((task) => {
            const record = task && typeof task === 'object'
              ? (task as Record<string, unknown>)
              : {};
            return {
              id: record._id,
              name: record.taskname,
              status: record.status,
            };
          })
        : [],
    })),
  };
}

function parseJsonObject(text: string): ModelAgentOutput | null {
  try {
    const parsed = JSON.parse(text) as ModelAgentOutput;
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1)) as ModelAgentOutput;
      } catch {
        return null;
      }
    }
  }
  return null;
}

function parseContextSummary(context: WorkspaceContext): Record<string, unknown> {
  try {
    return JSON.parse(summarizeWorkspaceContext(context)) as Record<string, unknown>;
  } catch {
    return { summary: summarizeWorkspaceContext(context) };
  }
}

async function getConversationHistory(
  userId: string,
  conversationId: string
): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
  const conversation = await AgentConversation.findOne({ userId, conversationId }).select(
    'messages'
  );

  return (conversation?.messages ?? [])
    .filter((message) => message.role === 'user' || message.role === 'assistant')
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role as 'user' | 'assistant',
      content: message.content,
    }));
}

function fallbackAgent(context: WorkspaceContext): ModelAgentOutput {
  const businessCount = context.businesses.length;
  const workloadCount = context.workloads.length;
  const bizInfraCount = Object.values(context.bizInfra).reduce(
    (total, items) => total + items.length,
    0
  );

  const summary = `I can see ${businessCount} business${businessCount === 1 ? '' : 'es'}, ${workloadCount} workload${workloadCount === 1 ? '' : 's'}, ${context.projects.length} project${context.projects.length === 1 ? '' : 's'}, and ${bizInfraCount} BizInfra resource${bizInfraCount === 1 ? '' : 's'} in your workspace.`;

  return {
    answer: `${summary}\n\nAI planning is unavailable right now, so I can summarize the workspace but cannot safely propose write actions until the model provider is reachable.`,
    proposedActions: [],
  };
}

async function runModelAgent(
  message: string,
  context: WorkspaceContext,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  scope?: AgentChatRequest['scope']
): Promise<ModelAgentOutput | null> {
  if (!isAiConfigured()) {
    return null;
  }

  const content = await generateModelText(
    [
      { role: 'system', content: buildAgentSystemPrompt() },
      {
        role: 'user',
        content: JSON.stringify(
          {
            workspaceContext: parseContextSummary(context),
            actionReference: actionReferenceForPrompt(context),
            conversationHistory: history,
            scope: scope ?? null,
            userMessage: message,
          },
          null,
          2
        ),
      },
    ],
    { maxTokens: 1800, temperature: 0.15 }
  );

  return content ? parseJsonObject(content) : null;
}

async function reconcileAgentOutput(
  message: string,
  context: WorkspaceContext,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  output: ModelAgentOutput,
  rejectedActionReason?: string,
  scope?: AgentChatRequest['scope']
): Promise<ModelAgentOutput | null> {
  if (!isAiConfigured()) {
    return null;
  }

  const content = await generateModelText(
    [
      {
        role: 'system',
        content: [
          'You are the AAKT agent action reconciler.',
          'Your job is to make the assistant response consistent with the available action tools.',
          '',
          'Rules:',
          '- Use only IDs present in workspaceContext.',
          '- If the latest user message asks for or approves a workspace change, return the matching proposedActions.',
          '- If the prior assistant proposed a change and the latest user accepts it, convert that proposal into proposedActions.',
          '- If the assistant draft says it will create, update, organize, mark, or proceed, return proposedActions or rewrite the answer as a clarifying question.',
          '- Never invent placeholder IDs.',
          '- Never propose delete/remove actions because deletion tools are unavailable.',
          '- Keep the answer short and operational.',
          '',
          'Available action tools:',
          toolContractForPrompt(),
          '',
          'Return strict JSON only: { "answer": string, "proposedActions": AgentActionDraft[] }',
        ].join('\n'),
      },
      {
        role: 'user',
        content: JSON.stringify(
          {
            workspaceContext: parseContextSummary(context),
            actionReference: actionReferenceForPrompt(context),
            conversationHistory: history,
            scope: scope ?? null,
            latestUserMessage: message,
            assistantDraft: output,
            rejectedActionReason: rejectedActionReason ?? null,
          },
          null,
          2
        ),
      },
    ],
    { maxTokens: 1800, temperature: 0.05 }
  );

  return content ? parseJsonObject(content) : null;
}

function normalizeActions(actions: unknown): AgentActionDraft[] {
  if (!Array.isArray(actions)) {
    return [];
  }

  return actions
    .slice(0, 6)
    .map((action) => sanitizeActionDraft(action as AgentActionDraft))
    .filter((action): action is AgentActionDraft => Boolean(action));
}

function inputString(action: AgentActionDraft, field: string): string | null {
  const value = action.input[field];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function containsPlaceholderId(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    PLACEHOLDER_ID_MARKERS.has(normalized) ||
    normalized.includes('newly_created') ||
    normalized.includes('placeholder') ||
    normalized.endsWith('_id')
  );
}

function contextIds(
  items: Array<Record<string, unknown>>,
  field = '_id'
): Set<string> {
  return new Set(
    items
      .map((item) => item[field])
      .filter((value): value is string | number | { toString(): string } => Boolean(value))
      .map((value) => String(value))
  );
}

function validateActionAgainstContext(
  action: AgentActionDraft,
  context: WorkspaceContext
): AgentActionDraft | null {
  const businessIds = contextIds(context.businesses);
  const workloadIds = contextIds(context.workloads);
  const projectIds = contextIds(context.projects);
  const phaseIds = contextIds(context.phases);
  const folderIds = contextIds(context.folders);
  const workloadTaskIds = new Set<string>();
  for (const workload of context.workloads) {
    if (!Array.isArray(workload.tasks)) {
      continue;
    }
    for (const task of workload.tasks) {
      if (task && typeof task === 'object' && (task as Record<string, unknown>)._id) {
        workloadTaskIds.add(String((task as Record<string, unknown>)._id));
      }
    }
  }

  const requiredIdsByTool: Partial<Record<AgentToolName, Array<[string, Set<string>]>>> = {
    create_agent: [['businessId', businessIds]],
    create_business_document: [['businessId', businessIds]],
    create_business_task: [['businessId', businessIds]],
    create_phase: [['projectId', projectIds]],
    create_process: [
      ['businessId', businessIds],
      ['projectId', projectIds],
      ['phaseId', phaseIds],
    ],
    create_project: [['businessId', businessIds]],
    create_workload_task: [['workloadId', workloadIds]],
    update_workload_task_status: [['workloadId', workloadIds]],
  };

  const requiredIds = requiredIdsByTool[action.toolName] ?? [];
  for (const [field, validIds] of requiredIds) {
    const value = inputString(action, field);
    if (!value || containsPlaceholderId(value) || !validIds.has(value)) {
      return null;
    }
  }

  const folderId = inputString(action, 'folderId');
  if (folderId && (containsPlaceholderId(folderId) || !folderIds.has(folderId))) {
    return null;
  }

  const taskId = inputString(action, 'taskId');
  if (action.toolName === 'update_workload_task_status') {
    if (!taskId || containsPlaceholderId(taskId) || !workloadTaskIds.has(taskId)) {
      return null;
    }
  }

  return action;
}

function normalizeGroundedActions(
  actions: unknown,
  context: WorkspaceContext
): AgentActionDraft[] {
  return normalizeActions(actions)
    .map((action) => validateActionAgainstContext(action, context))
    .filter((action): action is AgentActionDraft => Boolean(action));
}

function actionName(action: AgentActionDraft): string {
  const candidate =
    inputString(action, 'workloadname') ??
    inputString(action, 'projectName') ??
    inputString(action, 'phaseName') ??
    inputString(action, 'processName') ??
    inputString(action, 'folderName') ??
    inputString(action, 'taskName') ??
    inputString(action, 'taskname') ??
    inputString(action, 'name') ??
    action.title;

  return candidate.trim();
}

function enforceApprovalStepBoundary(
  output: ModelAgentOutput,
  drafts: AgentActionDraft[]
): { answer: string; drafts: AgentActionDraft[] } {
  const answer = output.answer?.trim() || 'I reviewed your workspace and prepared a response.';
  if (drafts.length <= 1) {
    return { answer, drafts };
  }

  const blockingToolPriority: AgentToolName[] = [
    'create_project',
    'create_phase',
    'create_workload',
    'create_folder',
  ];
  const blockingAction = blockingToolPriority
    .map((toolName) => drafts.find((action) => action.toolName === toolName))
    .find((action): action is AgentActionDraft => Boolean(action));

  if (!blockingAction) {
    return { answer, drafts };
  }

  const name = actionName(blockingAction);
  const revisedAnswer = [
    `I’ll start with the first safe step: ${blockingAction.title}.`,
    '',
    `After "${name}" is confirmed and created, I can propose the next tasks or process steps against the real workspace record.`,
  ].join('\n');

  return { answer: revisedAnswer, drafts: [blockingAction] };
}

function titleFromMessage(message: string): string {
  const compact = message.trim().replace(/\s+/g, ' ');
  if (!compact) {
    return 'New chat';
  }
  return compact.length > 60 ? `${compact.slice(0, 57)}...` : compact;
}

export async function runAaktAgent(
  userId: string,
  request: AgentChatRequest
): Promise<AgentChatResult> {
  const conversationId = request.conversationId || randomUUID();
  const [context, history] = await Promise.all([
    getWorkspaceContext(userId),
    getConversationHistory(userId, conversationId),
  ]);
  const modelOutput = await runModelAgent(
    request.message,
    context,
    history,
    request.scope
  ).catch((error) => {
    console.error('AI model failed, using deterministic fallback:', error);
    return null;
  });
  const initialOutput = modelOutput ?? fallbackAgent(context);
  const initialDrafts = normalizeGroundedActions(initialOutput.proposedActions, context);
  const shouldReconcile =
    isAiConfigured() &&
    initialDrafts.length === 0;
  const reconciledOutput = shouldReconcile
    ? await reconcileAgentOutput(
        request.message,
        context,
        history,
        initialOutput,
        Array.isArray(initialOutput.proposedActions) && initialOutput.proposedActions.length > 0
          ? 'The draft proposed actions, but none passed backend grounding validation.'
          : undefined,
        request.scope
      ).catch((error) => {
        console.error('AI action reconciliation failed:', error);
        return null;
      })
    : null;
  const reconciledDrafts = reconciledOutput
    ? normalizeGroundedActions(reconciledOutput.proposedActions, context)
    : [];
  const reconcilerReturnedInvalidActions =
    Boolean(reconciledOutput) &&
    Array.isArray(reconciledOutput?.proposedActions) &&
    reconciledOutput.proposedActions.length > 0 &&
    reconciledDrafts.length === 0;
  const output = reconciledOutput && !reconcilerReturnedInvalidActions
    ? reconciledOutput
    : initialOutput;
  const groundedDrafts = reconciledOutput && reconciledDrafts.length > 0
    ? reconciledDrafts
    : initialDrafts;
  const { answer, drafts } = enforceApprovalStepBoundary(output, groundedDrafts);

  const actionDocs = await Promise.all(
    drafts.map((action) =>
      AgentAction.create({
        actionId: randomUUID(),
        userId,
        conversationId,
        toolName: action.toolName as AgentToolName,
        title: action.title,
        description: action.description,
        input: action.input,
        status: 'pending',
      })
    )
  );

  await AgentConversation.findOneAndUpdate(
    { conversationId, userId },
    {
      $setOnInsert: {
        conversationId,
        userId,
        title: titleFromMessage(request.message),
      },
      $push: {
        messages: {
          $each: [
            {
              role: 'user',
              content: request.message,
              createdAt: new Date(),
            },
            {
              role: 'assistant',
              content: answer,
              actionIds: actionDocs.map((action) => action.actionId),
              createdAt: new Date(),
            },
          ],
        },
      },
    },
    { upsert: true, returnDocument: 'after' }
  );

  return {
    answer,
    conversationId,
    actions: actionDocs.map((doc, index) => ({
      ...drafts[index],
      actionId: doc.actionId,
      status: 'pending',
    })),
  };
}

export function splitAnswerForStreaming(answer: string): string[] {
  const chunks = answer.match(/\S+\s*/g);
  return chunks && chunks.length > 0 ? chunks : [answer];
}
