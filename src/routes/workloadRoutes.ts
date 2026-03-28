import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createWorkload,
    getWorkloads,
    deleteWorkload,
    createTask,
    deleteTask,
    archiveWorkload,
    inprogressWorkload,
    editWorkloadName,
    editTaskName,
    completeTask,
    todoTask,
} from '../controllers/workloadController';

const router = express.Router();

router.use(authenticateToken as any);

/**
 * @swagger
 * /workloads:
 *   post:
 *     summary: Create a new workload
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workloadname
 *             properties:
 *               workloadname:
 *                 type: string
 *                 example: "Sprint 1 Workload"
 *               status:
 *                 type: string
 *                 example: "In Progress"
 *     responses:
 *       201:
 *         description: Workload created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', createWorkload as any);

/**
 * @swagger
 * /workloads:
 *   get:
 *     summary: Get all workloads for the authenticated user
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', getWorkloads as any);

/**
 * @swagger
 * /workloads/getworkloadsbyuserid:
 *   get:
 *     summary: Get all workloads for the authenticated user by their user ID from the token
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/getworkloadsbyuserid', getWorkloads as any);


/**
 * @swagger
 * /workloads/{id}:
 *   delete:
 *     summary: Delete a workload
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workload ID
 *     responses:
 *       200:
 *         description: Workload deleted successfully
 *       404:
 *         description: Workload not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteWorkload as any);

/**
 * @swagger
 * /workloads/{id}/archive:
 *   patch:
 *     summary: Set workload status to Archive
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workload ID
 *     responses:
 *       200:
 *         description: Workload status updated to Archive
 *       404:
 *         description: Workload not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/archive', archiveWorkload as any);

/**
 * @swagger
 * /workloads/{id}/inprogress:
 *   patch:
 *     summary: Set workload status to In Progress
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workload ID
 *     responses:
 *       200:
 *         description: Workload status updated to In Progress
 *       404:
 *         description: Workload not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/inprogress', inprogressWorkload as any);

/**
 * @swagger
 * /workloads/{id}/name:
 *   patch:
 *     summary: Edit workload name
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workload ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workloadname
 *             properties:
 *               workloadname:
 *                 type: string
 *                 example: "New Sprint Name"
 *     responses:
 *       200:
 *         description: Workload name updated successfully
 *       404:
 *         description: Workload not found
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/name', editWorkloadName as any);

/**
 * @swagger
 * /workloads/{workloadId}/tasks:
 *   post:
 *     summary: Add a task to a workload
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workloadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workload ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskname
 *             properties:
 *               taskname:
 *                 type: string
 *                 example: "Fix bug in login"
 *               status:
 *                 type: string
 *                 example: "Todo"
 *     responses:
 *       201:
 *         description: Task added successfully
 *       404:
 *         description: Workload not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/:workloadId/tasks', createTask as any);

/**
 * @swagger
 * /workloads/{workloadId}/tasks/{taskId}:
 *   delete:
 *     summary: Remove a task from a workload
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workloadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workload ID
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task removed successfully
 *       404:
 *         description: Workload or Task not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:workloadId/tasks/:taskId', deleteTask as any);

/**
 * @swagger
 * /workloads/{workloadId}/tasks/{taskId}/name:
 *   patch:
 *     summary: Edit a task name in a workload
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workloadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workload ID
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskname
 *             properties:
 *               taskname:
 *                 type: string
 *                 example: "Updated task description"
 *     responses:
 *       200:
 *         description: Task name updated successfully
 *       404:
 *         description: Workload or Task not found
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.patch('/:workloadId/tasks/:taskId/name', editTaskName as any);

/**
 * @swagger
 * /workloads/{workloadId}/tasks/{taskId}/complete:
 *   patch:
 *     summary: Mark a task as completed in a workload
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workloadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workload ID
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task marked as completed successfully
 *       404:
 *         description: Workload or Task not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/:workloadId/tasks/:taskId/complete', completeTask as any);

/**
 * @swagger
 * /workloads/{workloadId}/tasks/{taskId}/todo:
 *   patch:
 *     summary: Set a task status to Todo in a workload
 *     tags: [Workloads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workloadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workload ID
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task status set to Todo successfully
 *       404:
 *         description: Workload or Task not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/:workloadId/tasks/:taskId/todo', todoTask as any);

export default router;
