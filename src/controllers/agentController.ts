import { Response } from 'express';
import { executeAgentAction } from '../ai/actionTools';
import { runAaktAgent, splitAnswerForStreaming } from '../ai/agent';
import { AgentToolName } from '../ai/types';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AgentAction } from '../models/agentActionModel';
import { AgentConversation } from '../models/agentConversationModel';

const MAX_AGENT_MESSAGE_LENGTH = 4000;
const STREAM_CHUNK_DELAY_MS = 8;

function getUserId(req: AuthenticatedRequest): string | null {
  return req.user?.id ?? null;
}

function resultName(result: Record<string, unknown>, fallback: string): string {
  const data = result.data;
  if (!data || typeof data !== 'object') {
    return fallback;
  }

  const record = data as Record<string, unknown>;
  const candidate =
    record.folderName ??
    record.businessName ??
    record.projectName ??
    record.phaseName ??
    record.processName ??
    record.workloadname ??
    record.taskName ??
    record.name ??
    record.title;

  return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : fallback;
}

function buildActionFollowUp(
  toolName: AgentToolName,
  title: string,
  result: Record<string, unknown>
): string {
  const name = resultName(result, title);

  switch (toolName) {
    case 'create_folder':
      return [
        `Done. I created the folder "${name}".`,
        '',
        'Next, I can help you move related documents into it, create business tasks for the folder, or review what still needs organizing.',
      ].join('\n');
    case 'create_business_task':
      return [
        `Done. I created the business task "${name}".`,
        '',
        'Next, I can link documents to it, add it to a workload, or break it into smaller operating steps.',
      ].join('\n');
    case 'create_business_document':
      return [
        `Done. I added the business document "${name}".`,
        '',
        'Next, I can connect it to a folder, tie it to a task, or review missing documents for this business.',
      ].join('\n');
    case 'create_project':
      return [
        `Done. I created the project "${name}".`,
        '',
        'Next, I can propose the first phase, define processes, or convert the project into workload tasks.',
      ].join('\n');
    case 'create_phase':
      return [
        `Done. I created the phase "${name}".`,
        '',
        'Next, I can define the process for this phase or create tasks to move it forward.',
      ].join('\n');
    case 'create_process':
      return [
        `Done. I created the process "${name}".`,
        '',
        'Next, I can turn this process into tasks, assign resources, or document the required inputs and outputs.',
      ].join('\n');
    case 'create_workload':
      return [
        `Done. I created the workload "${name}".`,
        '',
        'Next, I can add the first tasks, prioritize the workload, or connect it to a business goal.',
      ].join('\n');
    case 'create_workload_task':
      return [
        `Done. I added the workload task "${name}".`,
        '',
        'Next, I can add follow-up tasks, mark blockers, or organize this into a guided process.',
      ].join('\n');
    case 'update_workload_task_status':
      return [
        `Done. I updated "${name}".`,
        '',
        'Next, I can review remaining workload tasks or suggest the next highest-leverage step.',
      ].join('\n');
    case 'create_agent':
      return [
        `Done. I created the agent "${name}".`,
        '',
        'Next, I can define its responsibilities, connect it to a process, or draft its first operating task.',
      ].join('\n');
    case 'create_bizinfra_item':
      return [
        `Done. I added the BizInfra resource "${name}".`,
        '',
        'Next, I can map it to a business need, workload, or operating process.',
      ].join('\n');
    default:
      return [
        `Done. I completed "${title}".`,
        '',
        'Next, I can review the updated workspace or propose the next action.',
      ].join('\n');
  }
}

export const chatWithAgent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      res.status(400).json({ error: 'message is required.' });
      return;
    }
    if (message.length > MAX_AGENT_MESSAGE_LENGTH) {
      res.status(400).json({
        error: `message must be ${MAX_AGENT_MESSAGE_LENGTH} characters or fewer.`,
      });
      return;
    }

    const result = await runAaktAgent(userId, {
      conversationId:
        typeof req.body.conversationId === 'string' ? req.body.conversationId : undefined,
      message,
      scope: req.body.scope && typeof req.body.scope === 'object' ? req.body.scope : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Agent chat failed:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

function writeSse(res: Response, payload: Record<string, unknown>): void {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const streamChatWithAgent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.flushHeaders?.();

  try {
    const userId = getUserId(req);
    if (!userId) {
      writeSse(res, { type: 'error', error: 'Unauthorized' });
      res.end();
      return;
    }

    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      writeSse(res, { type: 'error', error: 'message is required.' });
      res.end();
      return;
    }
    if (message.length > MAX_AGENT_MESSAGE_LENGTH) {
      writeSse(res, {
        type: 'error',
        error: `message must be ${MAX_AGENT_MESSAGE_LENGTH} characters or fewer.`,
      });
      res.end();
      return;
    }

    const result = await runAaktAgent(userId, {
      conversationId:
        typeof req.body.conversationId === 'string' ? req.body.conversationId : undefined,
      message,
      scope: req.body.scope && typeof req.body.scope === 'object' ? req.body.scope : undefined,
    });

    writeSse(res, { type: 'start', conversationId: result.conversationId });
    for (const chunk of splitAnswerForStreaming(result.answer)) {
      writeSse(res, { type: 'delta', delta: chunk });
      await delay(STREAM_CHUNK_DELAY_MS);
    }
    writeSse(res, {
      type: 'done',
      answer: result.answer,
      conversationId: result.conversationId,
      actions: result.actions,
    });
    res.end();
  } catch (error) {
    console.error('Agent stream failed:', error);
    writeSse(res, { type: 'error', error: (error as Error).message });
    res.end();
  }
};

export const getAgentConversations = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const conversations = await AgentConversation.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(30)
      .select('conversationId title updatedAt createdAt messages');

    res.status(200).json({
      data: conversations.map((conversation) => ({
        conversationId: conversation.conversationId,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messageCount: conversation.messages.length,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAgentConversation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const conversation = await AgentConversation.findOne({
      userId,
      conversationId: req.params.conversationId,
    });

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found.' });
      return;
    }

    const actionIds = conversation.messages.flatMap((message) => message.actionIds || []);
    const actions = await AgentAction.find({ userId, actionId: { $in: actionIds } });

    res.status(200).json({
      data: {
        conversationId: conversation.conversationId,
        title: conversation.title,
        messages: conversation.messages,
        actions,
      },
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const confirmAgentAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const action = await AgentAction.findOneAndUpdate(
      {
        userId,
        actionId: req.params.actionId,
        status: 'pending',
      },
      { status: 'approved' },
      { returnDocument: 'after' }
    );

    if (!action) {
      const existing = await AgentAction.findOne({
        userId,
        actionId: req.params.actionId,
      });
      if (existing) {
        res.status(409).json({
          error: `Action is already ${existing.status}.`,
          data: existing,
        });
        return;
      }
      res.status(404).json({ error: 'Pending action not found.' });
      return;
    }

    try {
      const result = await executeAgentAction(
        action.toolName as AgentToolName,
        action.input,
        userId
      );
      action.status = 'executed';
      action.result = result;
      action.executedAt = new Date();
      await action.save();

      const assistantMessage = buildActionFollowUp(
        action.toolName as AgentToolName,
        action.title,
        result
      );
      await AgentConversation.findOneAndUpdate(
        { userId, conversationId: action.conversationId },
        {
          $push: {
            messages: {
              role: 'assistant',
              content: assistantMessage,
              createdAt: new Date(),
            },
          },
        }
      );

      res.status(200).json({
        message: 'Action executed successfully.',
        data: action,
        assistantMessage,
      });
    } catch (error) {
      action.status = 'failed';
      action.error = (error as Error).message;
      await action.save();
      res.status(400).json({ error: action.error, data: action });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const rejectAgentAction = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const action = await AgentAction.findOneAndUpdate(
      {
        userId,
        actionId: req.params.actionId,
        status: 'pending',
      },
      { status: 'rejected' },
      { returnDocument: 'after' }
    );

    if (!action) {
      res.status(404).json({ error: 'Pending action not found.' });
      return;
    }

    res.status(200).json({ message: 'Action rejected.', data: action });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
