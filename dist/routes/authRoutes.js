"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authRouter = express_1.default.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register endpoint
 *     description: Create a new user
 *     tags: [Authentication]
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
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully with token
 *       400:
 *         description: user already exists
 *       500:
 *         description: Internal server error
 */
authRouter.post("/register", (req, res) => {
    (0, userController_1.createUser)(req, res);
});
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login endpoint
 *     description: Authenticate user and return a JWT token
 *     tags: [Authentication]
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
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful response with token
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
authRouter.post("/login", (req, res) => {
    (0, userController_1.login)(req, res);
});
/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     summary: Google Login endpoint
 *     description: Authenticate Google user using ID token and return a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
 *                 description: Google ID token from client-side authentication
 *     responses:
 *       200:
 *         description: Successful response with JWT token
 *       400:
 *         description: Missing or invalid ID token
 *       401:
 *         description: Google authentication failed or invalid token
 *       404:
 *         description: User not found - please register first
 */
authRouter.post("/google-login", (req, res) => {
    (0, userController_1.googleLogin)(req, res);
});
/**
 * @swagger
 * /auth/google-register:
 *   post:
 *     summary: Google Register endpoint
 *     description: Create a new user with Google account using ID token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
 *                 description: Google ID token from client-side authentication
 *     responses:
 *       201:
 *         description: User created successfully with JWT token
 *       400:
 *         description: User already exists or invalid token
 *       401:
 *         description: Google authentication validation failed
 */
authRouter.post("/google-register", (req, res) => {
    (0, userController_1.googleRegister)(req, res);
});
/**
 * @swagger
 * /auth/getallusers:
 *   get:
 *     summary: Get all users endpoint
 *     description: Returns all users
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successful response
 */
authRouter.get("/getallusers", (req, res) => {
    (0, userController_1.getUsers)(req, res);
});
/**
 * @swagger
 * /auth/getuserbyid:
 *   get:
 *     summary: Get user by ID endpoint
 *     description: Returns user by ID
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successful response
 */
authRouter.get("/getuserbyid", (req, res) => {
    (0, userController_1.getUserById)(req, res);
});
/**
 * @swagger
 * /auth/updateuser/{id}:
 *   put:
 *     summary: Update user endpoint
 *     description: Updates user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successful response
 */
authRouter.put("/updateuser/:id", (req, res) => {
    (0, userController_1.updateUser)(req, res);
});
/**
 * @swagger
 * /auth/deleteuser/{id}:
 *   delete:
 *     summary: Delete user endpoint
 *     description: Deletes user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successful response
 */
authRouter.delete("/deleteuser/:id", (req, res) => {
    (0, userController_1.deleteUser)(req, res);
});
exports.default = authRouter;
//# sourceMappingURL=authRoutes.js.map