import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createCapitalItem,
    getCapitalItems,
    updateCapitalItem,
    deleteCapitalItem,
    updateCapitalStatus,
} from '../controllers/capitalController';

const router = express.Router();

// Require authorization token for all capital endpoints
router.use(authenticateToken as any);

/**
 * @swagger
 * /capital:
 *   post:
 *     summary: Create a new capital item
 *     tags: [Capital]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [source, amount]
 *             properties:
 *               source:
 *                 type: string
 *                 example: VC Fund A
 *               amount:
 *                 type: number
 *                 example: 500000
 *               status:
 *                 type: string
 *                 example: negotiating
 *               geography:
 *                 type: string
 *                 example: North America
 *               thesis:
 *                 type: string
 *                 example: Early stage SaaS
 *               notes:
 *                 type: string
 *                 example: Met at conference
 *     responses:
 *       201:
 *         description: Capital item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Capital'
 *       400:
 *         description: Source and Amount are required
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all capital items for the authenticated user
 *     tags: [Capital]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of capital items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Capital'
 *       401:
 *         description: Unauthorized
 */
router.post('/', createCapitalItem as any);
router.get('/', getCapitalItems as any);

/**
 * @swagger
 * /capital/{id}:
 *   put:
 *     summary: Update a capital item
 *     tags: [Capital]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               source:
 *                 type: string
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *               geography:
 *                 type: string
 *               thesis:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Capital item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Capital'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Capital item not found
 *   delete:
 *     summary: Delete a capital item
 *     tags: [Capital]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Capital item deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Capital item not found
 */
router.put('/:id', updateCapitalItem as any);
router.delete('/:id', deleteCapitalItem as any);

/**
 * @swagger
 * /capital/{id}/status:
 *   patch:
 *     summary: Update the status of a capital item
 *     tags: [Capital]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 example: approved
 *     responses:
 *       200:
 *         description: Capital status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Capital'
 *       400:
 *         description: Status is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Capital item not found
 */
router.patch('/:id/status', updateCapitalStatus as any);

export default router;
