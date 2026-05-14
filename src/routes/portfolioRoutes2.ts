import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  createProject,
  getProjects,
  updateProjectFolder,
  createPhase,
  getPhases,
  getBusinessPhases,
  createProcess,
  getProcesses,
  getBusinessProcesses,
  createDocument
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
 * /portfolio/projects/{projectId}/folder:
 *   patch:
 *     summary: Update project's associated folder
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - folderId
 *             properties:
 *               folderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project folder updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
portfolioRouter.patch('/projects/:projectId/folder', updateProjectFolder);

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
 * /portfolio/documents:
 *   post:
 *     summary: Create a new document
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
 *               - processId
 *               - documentName
 *               - url
 *             properties:
 *               processId:
 *                 type: string
 *               documentName:
 *                 type: string
 *               url:
 *                 type: string
 */
portfolioRouter.post('/documents', createDocument);

export default portfolioRouter;
