import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { submitBusinessDocument, getBusinessDocuments, getBusinessDocumentById } from '../controllers/businessDocumentController';

const businessDocumentRouter = express.Router();
businessDocumentRouter.use(authenticateToken as any);

/**
 * @swagger
 * /businessdocuments:
 *   post:
 *     summary: Submit a new business document
 *     description: Submit a new business document with a name and URL for a specific business
 *     tags: [BusinessDocuments]
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
 *               - name
 *               - url
 *             properties:
 *               businessId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *               name:
 *                 type: string
 *                 example: Q3 Tax Returns
 *               url:
 *                 type: string
 *                 example: https://example.com/docs/tax.pdf
 *     responses:
 *       201:
 *         description: Document submitted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
businessDocumentRouter.post('/', submitBusinessDocument);

/**
 * @swagger
 * /businessdocuments/{businessId}:
 *   get:
 *     summary: Get all business documents for a business
 *     description: Retrieve all documents associated with a specific business ID
 *     tags: [BusinessDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the business
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
businessDocumentRouter.get('/:businessId', getBusinessDocuments);

/**
 * @swagger
 * /businessdocuments/detail/{documentId}:
 *   get:
 *     summary: Get a single business document by ID
 *     description: Retrieve a single business document by its document ID
 *     tags: [BusinessDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the document
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *       400:
 *         description: Bad request - missing documentId
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal server error
 */
businessDocumentRouter.get('/detail/:documentId', getBusinessDocumentById);

export default businessDocumentRouter;
