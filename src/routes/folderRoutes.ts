import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { createFolder, getFolders, getFolderById } from '../controllers/folderController';

const folderRouter = express.Router();
folderRouter.use(authenticateToken as any);

/**
 * @swagger
 * /folders:
 *   post:
 *     summary: Create a new folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - folderName
 *             properties:
 *               folderName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Folder created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
folderRouter.post('/', createFolder);

/**
 * @swagger
 * /folders:
 *   get:
 *     summary: Get all folders for the authenticated user
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of folders
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
 *                       _id:
 *                         type: string
 *                       folderName:
 *                         type: string
 *                       userid:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
folderRouter.get('/', getFolders);

/**
 * @swagger
 * /folders/{id}:
 *   get:
 *     summary: Get a specific folder by ID
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the folder to retrieve
 *     responses:
 *       200:
 *         description: A single folder object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     folderName:
 *                       type: string
 *                     userid:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Folder ID is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Folder not found
 *       500:
 *         description: Server error
 */
folderRouter.get('/:id', getFolderById);

export default folderRouter;
