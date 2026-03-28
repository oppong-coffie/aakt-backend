import { Router } from "express";
import { getCompletedStatus } from "../controllers/homeController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /home/completed:
 *   get:
 *     summary: Get the completed status of the user's onboarding
 *     tags:
 *       - Home
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched completed status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Onboarding data not found
 *       500:
 *         description: Internal server error
 */
router.get("/completed", authenticateToken, getCompletedStatus);

export default router;
