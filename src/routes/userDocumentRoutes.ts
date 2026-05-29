import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createDocument,
    getDocuments,
    updateDocument,
    deleteDocument,
} from '../controllers/userDocumentController';

const router = express.Router();

// Require authorization token for all document endpoints
router.use(authenticateToken as any);

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Create a new document
 *     tags: [Documents]
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
 *                 example: Meeting Notes
 *               content:
 *                 type: string
 *                 example: Discussion points from the Q3 planning session...
 *     responses:
 *       201:
 *         description: Document created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDocument'
 *       400:
 *         description: Title is required
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all documents for the authenticated user
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents sorted by last updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDocument'
 *       401:
 *         description: Unauthorized
 */
router.post('/', createDocument as any);
router.get('/', getDocuments as any);

/**
 * @swagger
 * /documents/{id}:
 *   put:
 *     summary: Update an existing document
 *     tags: [Documents]
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDocument'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
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
 *         description: Document deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 */
router.put('/:id', updateDocument as any);
router.delete('/:id', deleteDocument as any);

export default router;
