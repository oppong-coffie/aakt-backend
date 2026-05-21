import { Response } from 'express';
import { executeAgentAction } from '../ai/actionTools';
import { runAaktAgent } from '../ai/agent';
import { AgentToolName } from '../ai/types';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AgentAction } from '../models/agentActionModel';
import { AgentConversation } from '../models/agentConversationModel';

const MAX_AGENT_MESSAGE_LENGTH = 4000;

function getUserId(req: AuthenticatedRequest): string | null {
  return req.user?.id ?? null;
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
      { new: true }
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
      res.status(200).json({ message: 'Action executed successfully.', data: action });
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
      { new: true }
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
