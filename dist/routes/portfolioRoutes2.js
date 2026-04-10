"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const portfolioController_1 = require("../controllers/portfolioController");
const portfolioRouter = express_1.default.Router();
portfolioRouter.use(authMiddleware_1.authenticateToken);
/**
 * @swagger
 * /portfolio/projects:
 *   post:
 *     summary: Create a new project
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
 *               - businessId
 *               - projectName
 *             properties:
 *               businessId:
 *                 type: string
 *               projectName:
 *                 type: string
 *               projectDescription:
 *                 type: string
 */
portfolioRouter.post('/projects', portfolioController_1.createProject);
/**
 * @swagger
 * /portfolio/projects/{businessId}:
 *   get:
 *     summary: Get projects by business ID
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 */
portfolioRouter.get('/projects/:businessId', portfolioController_1.getProjects);
/**
 * @swagger
 * /portfolio/phases:
 *   post:
 *     summary: Create a new phase
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.post('/phases', portfolioController_1.createPhase);
/**
 * @swagger
 * /portfolio/phases/{projectId}:
 *   get:
 *     summary: Get phases by project ID
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.get('/phases/:projectId', portfolioController_1.getPhases);
/**
 * @swagger
 * /portfolio/phases/all/{businessId}:
 *   get:
 *     summary: Get all phases for a business
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.get('/phases/all/:businessId', portfolioController_1.getBusinessPhases);
/**
 * @swagger
 * /portfolio/processes:
 *   post:
 *     summary: Create a new process
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.post('/processes', portfolioController_1.createProcess);
/**
 * @swagger
 * /portfolio/processes/{phaseId}:
 *   get:
 *     summary: Get processes by phase ID
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.get('/processes/:phaseId', portfolioController_1.getProcesses);
/**
 * @swagger
 * /portfolio/processes/all/{businessId}:
 *   get:
 *     summary: Get all processes for a business
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.get('/processes/all/:businessId', portfolioController_1.getBusinessProcesses);
/**
 * @swagger
 * /portfolio/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.post('/tasks', portfolioController_1.createTask);
exports.default = portfolioRouter;
//# sourceMappingURL=portfolioRoutes2.js.map