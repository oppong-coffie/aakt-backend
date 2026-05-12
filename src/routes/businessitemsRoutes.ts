import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { submitBusinessTask, getBusinessTasks, addDocumentToTask, getBusinessTaskById } from '../controllers/businessitemsController';

const businessitemsRouter = express.Router();
businessitemsRouter.use(authenticateToken as any);

/**
 * @swagger
 * /businessitems/task:
 *   post:
 *     summary: Submit a new business task
 *     description: Submit a new business task containing documents and a task name
 *     tags: [BusinessItems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessId
 *               - taskName
 *             properties:
 *               businessId:
 *                 type: string
 *                 description: The ID of the business
 *                 example: 60d21b4667d0d8992e610c85
 *               taskName:
 *                 type: string
 *                 description: The name of the task
 *                 example: Submit Quarterly Report
 *               documents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Q3 Financials
 *                     url:
 *                       type: string
 *                       example: https://example.com/docs/q3.pdf
 *     responses:
 *       201:
 *         description: Business task submitted successfully
 *       400:
 *         description: Bad request - missing or invalid fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
businessitemsRouter.post('/task', submitBusinessTask);

/**
 * @swagger
 * /businessitems/task/{businessId}:
 *   get:
 *     summary: Get all business tasks by business ID
 *     description: Retrieve a list of all business tasks associated with a specific business ID
 *     tags: [BusinessItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the business
 *         example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Business tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BusinessTask'
 *       400:
 *         description: Bad request - missing businessId
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
businessitemsRouter.get('/task/:businessId', getBusinessTasks);

/**
 * @swagger
 * /businessitems/task/detail/{taskId}:
 *   get:
 *     summary: Get a single business task by ID
 *     description: Retrieve a single business task details by its taskId
 *     tags: [BusinessItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the business task
 *         example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Business task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/BusinessTask'
 *       400:
 *         description: Bad request - missing taskId
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
businessitemsRouter.get('/task/detail/:taskId', getBusinessTaskById);

/**
 * @swagger
 * /businessitems/task/{taskId}/document:
 *   patch:
 *     summary: Append a document to a business task
 *     description: Add a new document (name and url) to the documents array of an existing business task
 *     tags: [BusinessItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the business task
 *         example: 60d21b4667d0d8992e610c85
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *                 example: Monthly Report
 *               url:
 *                 type: string
 *                 example: https://example.com/docs/monthly.pdf
 *     responses:
 *       200:
 *         description: Document added successfully
 *       400:
 *         description: Bad request - missing fields
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
businessitemsRouter.patch('/task/:taskId/document', addDocumentToTask);

export default businessitemsRouter;
