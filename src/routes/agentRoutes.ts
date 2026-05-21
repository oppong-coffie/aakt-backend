import express from 'express';
import {
  chatWithAgent,
  confirmAgentAction,
  getAgentConversation,
  getAgentConversations,
  rejectAgentAction,
} from '../controllers/agentController';
import { authenticateToken } from '../middleware/authMiddleware';

const agentRouter = express.Router();

agentRouter.use(authenticateToken as any);

agentRouter.post('/chat', chatWithAgent as any);
agentRouter.get('/conversations', getAgentConversations as any);
agentRouter.get('/conversations/:conversationId', getAgentConversation as any);
agentRouter.post('/actions/:actionId/confirm', confirmAgentAction as any);
agentRouter.post('/actions/:actionId/reject', rejectAgentAction as any);

export default agentRouter;
