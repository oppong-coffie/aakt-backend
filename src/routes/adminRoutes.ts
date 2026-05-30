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
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
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

/**
 * @swagger
 * /admin/admins:
 *   get:
 *     summary: Get all admins
 *     description: Retrieve all registered admins (excluding passwords)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: A list of admins
 *       500:
 *         description: Internal server error
 */
adminRouter.get("/admins", getAllAdmins);

/**
 * @swagger
 * /admin/admins/{id}:
 *   get:
 *     summary: Get admin by ID
 *     description: Retrieve detailed information for a single admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin ID
 *     responses:
 *       200:
 *         description: Admin details retrieved successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
adminRouter.get("/admins/:id", getAdminById);

/**
 * @swagger
 * /admin/admins/{id}:
 *   put:
 *     summary: Update an admin
 *     description: Modify details of a registered admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "newSecretPassword123"
 *               role:
 *                 type: string
 *                 enum: [admin, superadmin]
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Bad request (e.g., email already in use)
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
adminRouter.put("/admins/:id", updateAdmin);

/**
 * @swagger
 * /admin/admins/{id}:
 *   delete:
 *     summary: Delete an admin
 *     description: Remove an admin by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */
adminRouter.delete("/admins/:id", deleteAdmin);

/**
 * @swagger
 * /admin/projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve a list of all projects across all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: A list of projects
 *       500:
 *         description: Internal server error
 */
adminRouter.get("/projects", getAllProjects);

/**
 * @swagger
 * /admin/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     description: Retrieve detailed information for a single project
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project details retrieved successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
adminRouter.get("/projects/:id", getProjectById);

/**
 * @swagger
 * /admin/projects/{id}:
 *   put:
 *     summary: Update a project
 *     description: Modify details of a project
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectName:
 *                 type: string
 *                 example: "Acme Platform Migration"
 *               projectDescription:
 *                 type: string
 *                 example: "Migrating system workloads to AWS"
 *               businessId:
 *                 type: string
 *                 example: "60b9b3f3f50f2e00155b4a92"
 *               folderId:
 *                 type: string
 *                 example: "60b9b3f3f50f2e00155b4a93"
 *               userid:
 *                 type: string
 *                 example: "60b9b3f3f50f2e00155b4a94"
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
adminRouter.put("/projects/:id", updateProject);

/**
 * @swagger
 * /admin/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     description: Remove a project by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
adminRouter.delete("/projects/:id", deleteProject);

/**
 * @swagger
 * /admin/businesses/{id}:
 *   get:
 *     summary: Get business by ID
 *     description: Retrieve detailed information for a single business
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The business ID
 *     responses:
 *       200:
 *         description: Business details retrieved successfully
 *       404:
 *         description: Business not found
 *       500:
 *         description: Internal server error
 */
adminRouter.get("/businesses/:id", getBusinessById);

/**
 * @swagger
 * /admin/businesses/{id}:
 *   put:
 *     summary: Update a business
 *     description: Modify details of a business
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The business ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *                 example: "Acme Corp"
 *               product:
 *                 type: string
 *                 example: "SaaS Enterprise Software"
 *               customer:
 *                 type: string
 *                 example: "B2B Mid-market & Enterprise"
 *               goToMarket:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: ['online_store', 'direct_sales', 'retail', 'subscription', 'freemium', 'marketplace', 'consulting', 'partnerships']
 *                 example: ["direct_sales", "subscription"]
 *               culture:
 *                 type: string
 *                 example: "Customer-centric & Fast-paced"
 *               businessImage:
 *                 type: string
 *                 example: "https://example.com/logo.png"
 *               userid:
 *                 type: string
 *                 example: "60b9b3f3f50f2e00155b4a94"
 *     responses:
 *       200:
 *         description: Business updated successfully
 *       400:
 *         description: Bad request (e.g., invalid goToMarket format/value)
 *       404:
 *         description: Business not found
 *       500:
 *         description: Internal server error
 */
adminRouter.put("/businesses/:id", updateBusiness);

/**
 * @swagger
 * /admin/businesses/{id}:
 *   delete:
 *     summary: Delete a business
 *     description: Remove a business by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The business ID
 *     responses:
 *       200:
 *         description: Business deleted successfully
 *       404:
 *         description: Business not found
 *       500:
 *         description: Internal server error
 */
adminRouter.delete("/businesses/:id", deleteBusiness);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve detailed information for a single user (excluding password)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
adminRouter.get("/users/:id", getUserById);

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Modify details of a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "newSecretPassword123"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request (e.g., email already in use)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
adminRouter.put("/users/:id", updateUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Remove a user by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
adminRouter.delete("/users/:id", deleteUser);

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve compiled metrics and statistics for the admin dashboard (e.g. counts, monthly business growth, active businesses, and features)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       500:
 *         description: Internal server error
 */
adminRouter.get("/dashboard", getDashboardStats);

export default adminRouter;
