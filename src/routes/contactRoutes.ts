import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createContact,
    getContacts,
    updateContact,
    deleteContact,
} from '../controllers/contactController';

const router = express.Router();

// All contact routes require authorization token
router.use(authenticateToken as any);

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bessie Cooper
 *               role:
 *                 type: string
 *                 example: Web Designer
 *               email:
 *                 type: string
 *                 example: bessie.cooper@example.com
 *               phone:
 *                 type: string
 *                 example: +1 (555) 001-0203
 *               imageUrl:
 *                 type: string
 *                 example: https://firebasestorage.googleapis.com/...
 *               bio:
 *                 type: string
 *                 example: Passionate web designer...
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Name and Role are required
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all contacts for the authenticated user
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized
 */
router.post('/', createContact as any);
router.get('/', getContacts as any);

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update an existing contact
 *     tags: [Contacts]
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
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
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
 *         description: Contact deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 */
router.put('/:id', updateContact as any);
router.delete('/:id', deleteContact as any);

export default router;
