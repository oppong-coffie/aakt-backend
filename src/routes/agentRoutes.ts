import express from 'express';
import {
  chatWithAgent,
  confirmAgentAction,
  getAgentConversation,
  getAgentConversations,
  rejectAgentAction,
  streamChatWithAgent,
} from '../controllers/agentController';
import { authenticateToken } from '../middleware/authMiddleware';

const agentRouter = express.Router();

agentRouter.use(authenticateToken as any);

/**
 * @swagger
 * /agent/chat:
 *   post:
 *     summary: Send a message to the AI agent
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *                 maxLength: 4000
 *                 example: Create a new folder called Marketing
 *               conversationId:
 *                 type: string
 *                 description: Existing conversation ID to continue a chat
 *                 example: conv_abc123
 *               scope:
 *                 type: object
 *                 description: Optional scope context for the agent
 *     responses:
 *       200:
 *         description: Agent response with answer and optional actions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *                 conversationId:
 *                   type: string
 *                 actions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AgentAction'
 *       400:
 *         description: Message is required or exceeds max length
 *       401:
 *         description: Unauthorized
 */
agentRouter.post('/chat', chatWithAgent as any);

/**
 * @swagger
 * /agent/chat/stream:
 *   post:
 *     summary: Send a message to the AI agent with streaming response (SSE)
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *                 maxLength: 4000
 *                 example: Help me organize my workloads
 *               conversationId:
 *                 type: string
 *               scope:
 *                 type: object
 *     responses:
 *       200:
 *         description: Server-Sent Events stream with delta chunks
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *       400:
 *         description: Message is required or exceeds max length
 *       401:
 *         description: Unauthorized
 */
agentRouter.post('/chat/stream', streamChatWithAgent as any);

/**
 * @swagger
 * /agent/conversations:
 *   get:
 *     summary: Get recent agent conversations
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent conversations (max 30)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       conversationId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       messageCount:
 *                         type: number
 *       401:
 *         description: Unauthorized
 */
agentRouter.get('/conversations', getAgentConversations as any);

/**
 * @swagger
 * /agent/conversations/{conversationId}:
 *   get:
 *     summary: Get a specific agent conversation with messages and actions
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation details with messages and actions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     conversationId:
 *                       type: string
 *                     title:
 *                       type: string
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
 *                             enum: [user, assistant, system]
 *                           content:
 *                             type: string
 *                           actionIds:
 *                             type: array
 *                             items:
 *                               type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     actions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AgentAction'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
agentRouter.get('/conversations/:conversationId', getAgentConversation as any);

/**
 * @swagger
 * /agent/actions/{actionId}/confirm:
 *   post:
 *     summary: Confirm and execute a pending agent action
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: actionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Action executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/AgentAction'
 *                 assistantMessage:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pending action not found
 *       409:
 *         description: Action already processed
 */
agentRouter.post('/actions/:actionId/confirm', confirmAgentAction as any);

/**
 * @swagger
 * /agent/actions/{actionId}/reject:
 *   post:
 *     summary: Reject a pending agent action
 *     tags: [Agent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: actionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Action rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/AgentAction'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pending action not found
 */
agentRouter.post('/actions/:actionId/reject', rejectAgentAction as any);

export default agentRouter;
