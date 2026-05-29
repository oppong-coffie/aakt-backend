import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createFile,
    getFiles,
    updateFile,
    deleteFile,
} from '../controllers/userFileController';

const router = express.Router();

// Require authorization token for all file endpoints
router.use(authenticateToken as any);

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Upload/Create a new user file record
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, url]
 *             properties:
 *               name:
 *                 type: string
 *                 example: resume.pdf
 *               url:
 *                 type: string
 *                 example: https://firebasestorage.googleapis.com/v0/b/...
 *               size:
 *                 type: number
 *                 example: 204800
 *               type:
 *                 type: string
 *                 example: application/pdf
 *     responses:
 *       201:
 *         description: File record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserFile'
 *       400:
 *         description: Name and URL are required
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all file records for the authenticated user
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of files sorted by last updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserFile'
 *       401:
 *         description: Unauthorized
 */
router.post('/', createFile as any);
router.get('/', getFiles as any);

/**
 * @swagger
 * /files/{id}:
 *   put:
 *     summary: Update an existing file record
 *     tags: [Files]
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
 *               url:
 *                 type: string
 *               size:
 *                 type: number
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: File record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserFile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *   delete:
 *     summary: Delete a file record
 *     tags: [Files]
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
 *         description: File record deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 */
router.put('/:id', updateFile as any);
router.delete('/:id', deleteFile as any);

export default router;
