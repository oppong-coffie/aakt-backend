import express from "express";
import {
  getAllUsers,
  getAllOnboardings,
  getAllBusinesses,
  adminRegister,
  adminLogin,
  createAdminWorkload,
  createAdminTask,
  deleteAdminWorkload,
  editAdminWorkload,
  deleteAdminTask,
  changeAdminTaskStatus,
} from "../controllers/adminController";

const adminRouter = express.Router();

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new admin
 *     description: Create a new admin account with fullName, email, and password
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Admin User"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Admin with this email already exists
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/register", adminRegister);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate an admin with email and password
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Admin login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/login", adminLogin);

/**
 * @swagger
 * /admin/workloads:
 *   post:
 *     summary: Create an admin workload
 *     description: Create a new admin workload with a name
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Q3 Sprint Planning"
 *     responses:
 *       201:
 *         description: Admin workload created successfully
 *       400:
 *         description: name is required
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/workloads", createAdminWorkload);

/**
 * @swagger
 * /admin/workloads/{workloadId}/tasks:
 *   post:
 *     summary: Create a task in an admin workload
 *     description: Add a new task to an existing admin workload
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: workloadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin workload ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Review pull requests"
 *               status:
 *                 type: string
 *                 example: "Todo"
 *     responses:
 *       201:
 *         description: Admin task created successfully
 *       400:
 *         description: name is required
 *       404:
 *         description: Admin workload not found
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/workloads/:workloadId/tasks", createAdminTask);

/**
 * @swagger
 * /admin/workloads/{id}:
 *   delete:
 *     summary: Delete an admin workload
 *     description: Delete an admin workload by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin workload ID
 *     responses:
 *       200:
 *         description: Admin workload deleted successfully
 *       404:
 *         description: Admin workload not found
 *       500:
 *         description: Internal server error
 */
adminRouter.delete("/workloads/:id", deleteAdminWorkload);

/**
 * @swagger
 * /admin/workloads/{id}:
 *   put:
 *     summary: Edit an admin workload
 *     description: Update the name of an admin workload
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin workload ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Workload Name"
 *     responses:
 *       200:
 *         description: Admin workload updated successfully
 *       400:
 *         description: name is required
 *       404:
 *         description: Admin workload not found
 *       500:
 *         description: Internal server error
 */
adminRouter.put("/workloads/:id", editAdminWorkload);

/**
 * @swagger
 * /admin/workloads/{workloadId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete an admin task
 *     description: Remove a task from an admin workload
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: workloadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin workload ID
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Admin task deleted successfully
 *       404:
 *         description: Admin workload or task not found
 *       500:
 *         description: Internal server error
 */
adminRouter.delete("/workloads/:workloadId/tasks/:taskId", deleteAdminTask);

/**
 * @swagger
 * /admin/workloads/{workloadId}/tasks/{taskId}/status:
 *   patch:
 *     summary: Change admin task status
 *     description: Update the status of a task in an admin workload
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: workloadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin workload ID
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Completed"
 *     responses:
 *       200:
 *         description: Admin task status updated successfully
 *       400:
 *         description: status is required
 *       404:
 *         description: Admin workload or task not found
 *       500:
 *         description: Internal server error
 */
adminRouter.patch("/workloads/:workloadId/tasks/:taskId/status", changeAdminTaskStatus);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all registered users (Admin only)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: A list of users.
 */
adminRouter.get("/users", getAllUsers);

/**
 * @swagger
 * /admin/onboardings:
 *   get:
 *     summary: Get all onboarding data
 *     description: Retrieve onboarding details for all users (Admin only)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: A list of onboarding records.
 */
adminRouter.get("/onboardings", getAllOnboardings);
adminRouter.get("/onboarding", getAllOnboardings);

/**
 * @swagger
 * /admin/businesses:
 *   get:
 *     summary: Get all business data
 *     description: Retrieve all created businesses from portfolio (Admin only)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: A list of businesses.
 */
adminRouter.get("/businesses", getAllBusinesses);

export default adminRouter;
