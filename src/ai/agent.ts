import { randomUUID } from 'crypto';
import { AgentAction } from '../models/agentActionModel';
import { AgentConversation } from '../models/agentConversationModel';
import { sanitizeActionDraft } from './actionTools';
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

const CREATE_WORDS = ['create', 'add', 'make', 'build', 'set up', 'setup', 'plan'];
const MAX_HISTORY_MESSAGES = 8;

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

function getPreferredBusinessId(
  context: WorkspaceContext,
  scope?: AgentChatRequest['scope']
): string | null {
  if (scope?.businessId) {
    const scopedBusiness = context.businesses.find(
      (business) => String(business._id) === scope.businessId
    );
    if (scopedBusiness?._id) {
      return String(scopedBusiness._id);
    }
  }

  const business = context.businesses[0];
  return business?._id ? String(business._id) : null;
}

function getPreferredWorkloadId(
  context: WorkspaceContext,
  scope?: AgentChatRequest['scope']
): string | null {
  if (scope?.workloadId) {
    const scopedWorkload = context.workloads.find(
      (workload) => String(workload._id) === scope.workloadId
    );
    if (scopedWorkload?._id) {
      return String(scopedWorkload._id);
    }
  }

  const workload = context.workloads[0];
  return workload?._id ? String(workload._id) : null;
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

function fallbackAgent(
  message: string,
  context: WorkspaceContext,
  scope?: AgentChatRequest['scope']
): ModelAgentOutput {
  const lower = message.toLowerCase();
  const wantsCreation = CREATE_WORDS.some((word) => lower.includes(word));
  const businessCount = context.businesses.length;
  const workloadCount = context.workloads.length;
  const bizInfraCount = Object.values(context.bizInfra).reduce(
    (total, items) => total + items.length,
    0
  );

  const summary = `I can see ${businessCount} business${businessCount === 1 ? '' : 'es'}, ${workloadCount} workload${workloadCount === 1 ? '' : 's'}, ${context.projects.length} project${context.projects.length === 1 ? '' : 's'}, and ${bizInfraCount} BizInfra resource${bizInfraCount === 1 ? '' : 's'} in your workspace.`;

  if (!wantsCreation) {
    return {
      answer: `${summary}\n\nAsk me to plan work, create tasks, organize resources, or summarize a specific business/workload and I can propose safe actions for confirmation.`,
      proposedActions: [],
    };
  }

  const actions: AgentActionDraft[] = [];
  const businessId = getPreferredBusinessId(context, scope);
  const workloadId = getPreferredWorkloadId(context, scope);

  if (lower.includes('workload') || lower.includes('task')) {
    if (workloadId && lower.includes('task')) {
      actions.push({
        toolName: 'create_workload_task',
        title: 'Create a planning task',
        description: 'Add a first planning task to the latest workload.',
        input: {
          workloadId,
          taskname: 'Clarify next milestone',
          status: 'Todo',
        },
      });
    } else {
      actions.push({
        toolName: 'create_workload',
        title: 'Create a planning workload',
        description: 'Create a new workload column for AI-assisted planning.',
        input: {
          workloadname: 'AI Planning',
          status: 'Pending',
        },
      });
    }
  }

  if (businessId && (lower.includes('project') || lower.includes('launch') || lower.includes('plan'))) {
    actions.push({
      toolName: 'create_project',
      title: 'Create a project plan',
      description: 'Create a starter project under your most recent business.',
      input: {
        businessId,
        projectName: 'AI Generated Project Plan',
        projectDescription: 'A starter project created from the assistant conversation.',
      },
    });
  }

  if (businessId && (lower.includes('agent') || lower.includes('assistant') || lower.includes('team'))) {
    actions.push({
      toolName: 'create_agent',
      title: 'Create an AI operator agent',
      description: 'Create a starter AI agent record for this business.',
      input: {
        businessId,
        name: 'AAKT Planning Agent',
        kind: 'ai',
        title: 'Business Operations Assistant',
        email: `agent-${Date.now()}@aakt.local`,
        timezone: 'UTC',
      },
    });
  }

  if (actions.length === 0) {
    actions.push({
      toolName: 'create_folder',
      title: 'Create an organization folder',
      description: 'Create a folder for organizing upcoming business work.',
      input: {
        folderName: 'AI Organized Work',
      },
    });
  }

  return {
    answer: `${summary}\n\nI drafted ${actions.length} safe action${actions.length === 1 ? '' : 's'} for your approval. Review them before anything changes.`,
    proposedActions: actions,
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

function normalizeActions(actions: unknown): AgentActionDraft[] {
  if (!Array.isArray(actions)) {
    return [];
  }

  return actions
    .slice(0, 6)
    .map((action) => sanitizeActionDraft(action as AgentActionDraft))
    .filter((action): action is AgentActionDraft => Boolean(action));
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
  const output = modelOutput ?? fallbackAgent(request.message, context, request.scope);
  const answer = output.answer?.trim() || 'I reviewed your workspace and prepared a response.';
  const drafts = normalizeActions(output.proposedActions);

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
    { upsert: true, new: true }
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
