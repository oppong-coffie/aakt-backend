"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homeController_1 = require("../controllers/homeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
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
router.get("/completed", authMiddleware_1.authenticateToken, homeController_1.getCompletedStatus);
exports.default = router;
//# sourceMappingURL=homeRoute.js.map