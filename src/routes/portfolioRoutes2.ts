import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  createProject,
  getProjects,
  createPhase,
  getPhases,
  getBusinessPhases,
  createProcess,
  getProcesses,
  getBusinessProcesses,
  createTask
} from '../controllers/portfolioController';

const portfolioRouter = express.Router();
portfolioRouter.use(authenticateToken as any);

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
portfolioRouter.post('/projects', createProject);

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
portfolioRouter.get('/projects/:businessId', getProjects);

/**
 * @swagger
 * /portfolio/phases:
 *   post:
 *     summary: Create a new phase
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.post('/phases', createPhase);

/**
 * @swagger
 * /portfolio/phases/{projectId}:
 *   get:
 *     summary: Get phases by project ID
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.get('/phases/:projectId', getPhases);

/**
 * @swagger
 * /portfolio/phases/all/{businessId}:
 *   get:
 *     summary: Get all phases for a business
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.get('/phases/all/:businessId', getBusinessPhases);

/**
 * @swagger
 * /portfolio/processes:
 *   post:
 *     summary: Create a new process
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.post('/processes', createProcess);

/**
 * @swagger
 * /portfolio/processes/{phaseId}:
 *   get:
 *     summary: Get processes by phase ID
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.get('/processes/:phaseId', getProcesses);

/**
 * @swagger
 * /portfolio/processes/all/{businessId}:
 *   get:
 *     summary: Get all processes for a business
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.get('/processes/all/:businessId', getBusinessProcesses);

/**
 * @swagger
 * /portfolio/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
portfolioRouter.post('/tasks', createTask);

export default portfolioRouter;
