import express from "express";
import { createOrUpdateOnboarding, getOnboarding, sendStage, sendSkills, sendStep, sendConfident, sendFeeling } from "../controllers/onboardingController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Onboarding
 *   description: Onboarding management
 */

/**
 * @swagger
 * /onboarding:
 *   post:
 *     summary: Create or update onboarding data
 *     description: Creates a new onboarding record for the authenticated user or updates it if it already exists.
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 example: USA
 *               numberofbusinesses:
 *                 type: number
 *                 example: 2
 *               teamsize:
 *                 type: string
 *                 example: "10-50"
 *               referralcode:
 *                 type: string
 *                 example: "REF123"
 *               otp:
 *                 type: number
 *                 example: 1
 *               stage:
 *                 type: string
 *                 example: "Seed"
 *               product:
 *                 type: string
 *                 example: "SaaS Platform"
 *               strategy:
 *                 type: string
 *                 example: "B2B"
 *               team:
 *                 type: string
 *                 example: "In-house"
 *               finance:
 *                 type: string
 *                 example: "Bootstrap"
 *               growth:
 *                 type: string
 *                 example: "High"
 *     responses:
 *       200:
 *         description: Onboarding updated successfully
 *       201:
 *         description: Onboarding created successfully
 *       401:
 *         description: Unauthorized - Access token is missing or invalid
 *       500:
 *         description: Internal server error
 */

// Apply auth middleware to all onboarding routes
router.use(authenticateToken as any);

// Create or Update onboarding data (handles both POST and PUT/PATCH on the same endpoint based on if it exists)
router.post("/", createOrUpdateOnboarding as any);

// GET route to retrieve the current onboarding state
router.get("/", getOnboarding as any);

/**
 * @swagger
 * /onboarding/stage:
 *   post:
 *     summary: Update onboarding stage
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stage
 *             properties:
 *               stage:
 *                 type: string
 *                 example: "Registration"
 *     responses:
 *       200:
 *         description: Stage updated successfully
 *       400:
 *         description: Bad request
 */
router.post("/stage", sendStage as any);

/**
 * @swagger
 * /onboarding/step:
 *   post:
 *     summary: Update onboarding step
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - step
 *             properties:
 *               step:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       200:
 *         description: Step updated successfully
 *       400:
 *         description: Bad request
 */
router.post("/step", sendStep as any);

/**
 * @swagger
 * /onboarding/skills:
 *   post:
 *     summary: Update onboarding skills
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skills
 *             properties:
 *               skills:
 *                 type: object
 *                 properties:
 *                   product: { type: string, example: "SaaS Platform" }
 *                   strategy: { type: string, example: "B2B" }
 *                   team: { type: string, example: "In-house" }
 *                   finance: { type: string, example: "Bootstrap" }
 *     responses:
 *       200:
 *         description: Skills updated successfully
 */
router.post("/skills", sendSkills as any);

/**
 * @swagger
 * /onboarding/feeling:
 *   post:
 *     summary: Update onboarding feeling data
 *     description: Updates the 'feeling' array (4 numbers) for the authenticated user's onboarding process.
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - feeling
 *             properties:
 *               feeling:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [37, 95, 61, 95]
 *     responses:
 *       200:
 *         description: Feeling updated successfully
 */
router.post("/feeling", sendFeeling as any);

/**
 * @swagger
 * /onboarding/confident:
 *   post:
 *     summary: Update onboarding confident data
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - confident
 *             properties:
 *               confident:
 *                 type: object
 *                 properties:
 *                   capital: { type: number, example: 10 }
 *                   influence: { type: number, example: 10 }
 *                   intel: { type: number, example: 10 }
 *                   network: { type: number, example: 24 }
 *                   skillset: { type: number, example: 38 }
 *     responses:
 *       200:
 *         description: Confident data updated successfully
 */
router.post("/confident", sendConfident as any);

export default router;
