"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const onboardingController_1 = require("../controllers/onboardingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
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
router.use(authMiddleware_1.authenticateToken);
// Create or Update onboarding data (handles both POST and PUT/PATCH on the same endpoint based on if it exists)
router.post("/", onboardingController_1.createOrUpdateOnboarding);
// GET route to retrieve the current onboarding state
router.get("/", onboardingController_1.getOnboarding);
/**
 * @swagger
 * /onboarding/send-otp:
 *   post:
 *     summary: Send OTP email
 *     description: Sends an OTP to the authenticated user's email address.
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/send-otp", onboardingController_1.sendOtpEmail);
/**
 * @swagger
 * /onboarding/verify-otp:
 *   post:
 *     summary: Verify OTP code
 *     description: Verifies the OTP code sent securely by comparing to the database.
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
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 *       404:
 *         description: Onboarding data not found
 *       500:
 *         description: Internal server error
 */
router.post("/verify-otp", onboardingController_1.verifyOtp);
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
router.post("/stage", onboardingController_1.sendStage);
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
router.post("/step", onboardingController_1.sendStep);
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
router.post("/skills", onboardingController_1.sendSkills);
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
router.post("/feeling", onboardingController_1.sendFeeling);
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
router.post("/confident", onboardingController_1.sendConfident);
exports.default = router;
//# sourceMappingURL=onboardingRoute.js.map