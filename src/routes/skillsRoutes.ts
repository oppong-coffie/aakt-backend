import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createSkill, getSkills, getSkillById, updateSkill, deleteSkill,
    createSkillProject, getSkillProjects, getSkillProjectById, updateSkillProject, deleteSkillProject,
    createSkillPhase, getSkillPhases, getSkillPhaseById, updateSkillPhase, deleteSkillPhase,
    createSkillTask, getSkillTasks, getSkillTaskById, updateSkillTask, deleteSkillTask,
    createSkillDocument, getSkillDocuments, getSkillDocumentById, updateSkillDocument, deleteSkillDocument,
    addTaskDocument, getTaskDocuments, deleteTaskDocument
} from '../controllers/skillsController';

const skillsRouter = express.Router();
skillsRouter.use(authenticateToken as any);

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Endpoints for managing skills, projects, phases, tasks, and documents
 */

// ==========================================
// SKILL ROUTES
// ==========================================

/**
 * @swagger
 * /skills:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillname
 *             properties:
 *               skillname:
 *                 type: string
 *                 example: Python Developer
 *               imageurl:
 *                 type: string
 *                 example: https://example.com/icons/python.png
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Retrieve all skills for the authenticated user
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Skills retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
skillsRouter.post('/', createSkill as any);
skillsRouter.get('/', getSkills as any);



// ==========================================
// SKILL PROJECT ROUTES
// ==========================================

/**
 * @swagger
 * /skills/projects:
 *   post:
 *     summary: Create a project under a skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillid
 *               - projectname
 *             properties:
 *               skillid:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *               projectname:
 *                 type: string
 *                 example: Building REST API
 *               projectimageurl:
 *                 type: string
 *                 example: https://github.com/example/api
 *     responses:
 *       201:
 *         description: Project created successfully
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get projects, optionally filtered by skillid query parameter
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skillid
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       500:
 *         description: Internal server error
 */
skillsRouter.post('/projects', createSkillProject as any);
skillsRouter.get('/projects', getSkillProjects as any);

/**
 * @swagger
 * /skills/projects/{id}:
 *   get:
 *     summary: Retrieve a single project by ID
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 *   put:
 *     summary: Update an existing project
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectname:
 *                 type: string
 *               projectimageurl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 *   delete:
 *     summary: Delete a project and cascading phases, tasks, and documents
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
skillsRouter.get('/projects/:id', getSkillProjectById as any);
skillsRouter.put('/projects/:id', updateSkillProject as any);
skillsRouter.delete('/projects/:id', deleteSkillProject as any);


// ==========================================
// SKILL PHASE ROUTES
// ==========================================

/**
 * @swagger
 * /skills/phases:
 *   post:
 *     summary: Create a phase under a project
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectid
 *               - phasename
 *             properties:
 *               projectid:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *               phasename:
 *                 type: string
 *                 example: Setup and Configuration
 *     responses:
 *       201:
 *         description: Phase created successfully
 *       404:
 *         description: Project not found
 *   get:
 *     summary: Get phases, optionally filtered by projectid query parameter
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectid
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Phases retrieved successfully
 */
skillsRouter.post('/phases', createSkillPhase as any);
skillsRouter.get('/phases', getSkillPhases as any);

/**
 * @swagger
 * /skills/phases/{id}:
 *   get:
 *     summary: Retrieve a phase by ID
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Phase retrieved successfully
 *   put:
 *     summary: Update an existing phase
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phasename:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phase updated successfully
 *   delete:
 *     summary: Delete a phase and cascading tasks and documents
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Phase deleted successfully
 */
skillsRouter.get('/phases/:id', getSkillPhaseById as any);
skillsRouter.put('/phases/:id', updateSkillPhase as any);
skillsRouter.delete('/phases/:id', deleteSkillPhase as any);


// ==========================================
// SKILL TASK ROUTES
// ==========================================

/**
 * @swagger
 * /skills/tasks:
 *   post:
 *     summary: Create a task under a phase
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phaseid
 *               - taskname
 *             properties:
 *               phaseid:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *               taskname:
 *                 type: string
 *                 example: Initialize git repository
 *               taskstatus:
 *                 type: string
 *                 example: pending
 *     responses:
 *       201:
 *         description: Task created successfully
 *   get:
 *     summary: Get tasks, optionally filtered by phaseid query parameter
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: phaseid
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 */
skillsRouter.post('/tasks', createSkillTask as any);
skillsRouter.get('/tasks', getSkillTasks as any);

/**
 * @swagger
 * /skills/tasks/{id}:
 *   get:
 *     summary: Retrieve a task by ID
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *   put:
 *     summary: Update an existing task
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskname:
 *                 type: string
 *               taskstatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *   delete:
 *     summary: Delete a task
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
skillsRouter.get('/tasks/:id', getSkillTaskById as any);
skillsRouter.put('/tasks/:id', updateSkillTask as any);
skillsRouter.delete('/tasks/:id', deleteSkillTask as any);

// Skill Task Documents (Nested)
skillsRouter.post('/tasks/:id/documents', addTaskDocument as any);
skillsRouter.get('/tasks/:id/documents', getTaskDocuments as any);
skillsRouter.delete('/tasks/:id/documents/:docId', deleteTaskDocument as any);


// ==========================================
// SKILL DOCUMENT ROUTES
// ==========================================

/**
 * @swagger
 * /skills/documents:
 *   post:
 *     summary: Add a document to a phase
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phaseid
 *               - documentname
 *               - documenturl
 *             properties:
 *               phaseid:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *               documentname:
 *                 type: string
 *                 example: Design Spec
 *               documenturl:
 *                 type: string
 *                 example: https://example.com/docs/spec.pdf
 *     responses:
 *       201:
 *         description: Document added successfully
 *   get:
 *     summary: Get documents, optionally filtered by phaseid query parameter
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: phaseid
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 */
skillsRouter.post('/documents', createSkillDocument as any);
skillsRouter.get('/documents', getSkillDocuments as any);

/**
 * @swagger
 * /skills/documents/{id}:
 *   get:
 *     summary: Retrieve a document by ID
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *   put:
 *     summary: Update an existing document
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentname:
 *                 type: string
 *               documenturl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document updated successfully
 *   delete:
 *     summary: Delete a document
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted successfully
 */
skillsRouter.get('/documents/:id', getSkillDocumentById as any);
skillsRouter.put('/documents/:id', updateSkillDocument as any);
skillsRouter.delete('/documents/:id', deleteSkillDocument as any);

/**
 * @swagger
 * /skills/{id}:
 *   get:
 *     summary: Retrieve a single skill by ID
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill retrieved successfully
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update an existing skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skillname:
 *                 type: string
 *               imageurl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a skill and all related projects, phases, tasks, and documents
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill and all downstream children deleted successfully
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 */
skillsRouter.get('/:id', getSkillById as any);
skillsRouter.put('/:id', updateSkill as any);
skillsRouter.delete('/:id', deleteSkill as any);

export default skillsRouter;
