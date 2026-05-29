import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createWhiteboard,
    getWhiteboards,
    updateWhiteboard,
    deleteWhiteboard,
} from '../controllers/userWhiteboardController';

const router = express.Router();

// Require authorization token for all whiteboard endpoints
router.use(authenticateToken as any);

/**
 * @swagger
 * /whiteboard:
 *   post:
 *     summary: Create a new whiteboard
 *     tags: [Whiteboards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Brainstorming Session
 *               elements:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: Canvas elements (shapes, text, drawings, etc.)
 *                 example: []
 *     responses:
 *       201:
 *         description: Whiteboard created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWhiteboard'
 *       400:
 *         description: Title is required
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all whiteboards for the authenticated user
 *     tags: [Whiteboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of whiteboards sorted by last updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserWhiteboard'
 *       401:
 *         description: Unauthorized
 */
router.post('/', createWhiteboard as any);
router.get('/', getWhiteboards as any);

/**
 * @swagger
 * /whiteboard/{id}:
 *   put:
 *     summary: Update an existing whiteboard
 *     tags: [Whiteboards]
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
 *               title:
 *                 type: string
 *               elements:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Whiteboard updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWhiteboard'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Whiteboard not found
 *   delete:
 *     summary: Delete a whiteboard
 *     tags: [Whiteboards]
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
 *         description: Whiteboard deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Whiteboard not found
 */
router.put('/:id', updateWhiteboard as any);
router.delete('/:id', deleteWhiteboard as any);

export default router;
