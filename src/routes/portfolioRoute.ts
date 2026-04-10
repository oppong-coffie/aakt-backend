import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  createBusiness,
  getBusiness,
} from '../controllers/portfolioController';

const portfolioRouter = express.Router();
portfolioRouter.use(authenticateToken as any);

/**
 * @swagger
 * /business:
 *   post:
 *     summary: Create a new business
 *     description: Create a new business with the provided details
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *               - bizConcept
 *             properties:
 *               businessName:
 *                 type: string
 *                 example: My Awesome Business
 *               businessImage:
 *                 type: string
 *                 example: https://example.com/image.png
 *               bizConcept:
 *                 type: object
 *                 required:
 *                   - product
 *                   - customer
 *                   - goToMarket
 *                   - culture
 *                 properties:
 *                   product:
 *                     type: string
 *                     example: Software as a Service
 *                   customer:
 *                     type: string
 *                     example: Small to medium businesses
 *                   goToMarket:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [online_store, direct_sales, retail, subscription, freemium, marketplace, consulting, partnerships]
 *                     example: ["online_store", "subscription"]
 *                   culture:
 *                     type: string
 *                     example: Innovative and customer-focused
 *     responses:
 *       201:
 *         description: Business created successfully
 *       400:
 *         description: Bad request - missing or invalid fields
 *       500:
 *         description: Internal server error
 */
portfolioRouter.post('/', createBusiness);

/**
 * @swagger
 * /business:
 *   get:
 *     summary: Get all businesses for the authenticated user
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Businesses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
portfolioRouter.get('/', getBusiness);

export default portfolioRouter;