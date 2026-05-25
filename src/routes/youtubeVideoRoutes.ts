import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getYoutubeVideos,
  addYoutubeVideo,
  deleteYoutubeVideo
} from '../controllers/youtubeVideoController';

const router = express.Router();

// Apply authentication middleware to all endpoints in this router
router.use(authenticateToken as any);

/**
 * @swagger
 * /youtube:
 *   get:
 *     summary: Retrieve all saved YouTube videos for the authenticated user
 *     tags: [YouTube]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of YouTube videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   videoId:
 *                     type: string
 *                   title:
 *                     type: string
 *                   addedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Access token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/', getYoutubeVideos as any);

/**
 * @swagger
 * /youtube:
 *   post:
 *     summary: Save a new YouTube video for the authenticated user
 *     tags: [YouTube]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - videoId
 *               - title
 *             properties:
 *               videoId:
 *                 type: string
 *                 description: The YouTube video ID
 *                 example: dQw4w9WgXcQ
 *               title:
 *                 type: string
 *                 description: The title of the YouTube video
 *                 example: Rick Astley - Never Gonna Give You Up
 *     responses:
 *       201:
 *         description: Video saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 videoId:
 *                   type: string
 *                 title:
 *                   type: string
 *                 addedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Video ID and title are required
 *       401:
 *         description: Access token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post('/', addYoutubeVideo as any);

/**
 * @swagger
 * /youtube/{id}:
 *   delete:
 *     summary: Delete a saved YouTube video by ID
 *     tags: [YouTube]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The database ID of the saved video
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       401:
 *         description: Access token is missing or invalid
 *       404:
 *         description: Video not found or unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteYoutubeVideo as any);

export default router;
