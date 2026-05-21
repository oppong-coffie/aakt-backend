import express from "express";
import { getAllUsers, getAllOnboardings, getAllBusinesses } from "../controllers/adminController";

const adminRouter = express.Router();

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

