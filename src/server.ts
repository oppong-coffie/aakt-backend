import "source-map-support/register";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/authRoutes";
import onboardingRouter from "./routes/onboardingRoute";
import bizInfraRouter from "./routes/bizInfraRoutes";
import portfolioRouter from "./routes/portfolioRoutes2";
import portfolioBusinessRouter from "./routes/portfolioRoute";
import workloadRouter from "./routes/workloadRoutes";
import homeRouter from "./routes/homeRoute";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import mongoose from 'mongoose';
import googleOAuthClient from "./config/googleOAuth";

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan("tiny"));
app.use(express.json());

// Add security headers (less restrictive for OAuth)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com; connect-src 'self' https://accounts.google.com https://www.google.com http://localhost:*"
  );
  next();
});

// Initialize Google OAuth Provider
const initializeGoogleOAuth = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
        console.warn('⚠️  WARNING: Google OAuth environment variables are not set.');
        console.warn('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file');
        console.warn('Get credentials from: https://console.cloud.google.com/');
    } else {
        console.log('✓ Google OAuth Provider initialized successfully');
    }
};

// Initialize Google OAuth on server startup
initializeGoogleOAuth();

// Routes
app.use("/auth", authRouter);
app.use("/onboarding", onboardingRouter);
app.use("/bizinfra", bizInfraRouter);
// Business-specific portfolio routes must be registered before generic legacy routes.
app.use("/business", portfolioBusinessRouter);
app.use("/portfolio", portfolioRouter);
app.use("/workloads", workloadRouter);
app.use("/home", homeRouter);

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;