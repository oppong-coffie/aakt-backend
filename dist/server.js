"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const onboardingRoute_1 = __importDefault(require("./routes/onboardingRoute"));
const bizInfraRoutes_1 = __importDefault(require("./routes/bizInfraRoutes"));
const portfolioRoutes_1 = __importDefault(require("./routes/portfolioRoutes"));
const workloadRoutes_1 = __importDefault(require("./routes/workloadRoutes"));
const homeRoute_1 = __importDefault(require("./routes/homeRoute"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
// Initialize express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
// Add security headers (less restrictive for OAuth)
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com; connect-src 'self' https://accounts.google.com https://www.google.com http://localhost:*");
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
    }
    else {
        console.log('✓ Google OAuth Provider initialized successfully');
    }
};
// Initialize Google OAuth on server startup
initializeGoogleOAuth();
// Routes
app.use("/auth", authRoutes_1.default);
app.use("/onboarding", onboardingRoute_1.default);
app.use("/bizinfra", bizInfraRoutes_1.default);
app.use("/portfolio", portfolioRoutes_1.default);
app.use("/workloads", workloadRoutes_1.default);
app.use("/home", homeRoute_1.default);
// Swagger documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
exports.default = app;
//# sourceMappingURL=server.js.map