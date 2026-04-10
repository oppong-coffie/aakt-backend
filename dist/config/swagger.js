"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "AAKT Backend API",
        version: "1.0.0",
        description: "API documentation for the AAKT backend",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Business: {
                type: 'object',
                required: ['businessName'],
                properties: {
                    businessName: {
                        type: 'string',
                        example: 'My Awesome Business'
                    },
                    product: {
                        type: 'string',
                        example: 'Software as a Service'
                    },
                    customer: {
                        type: 'string',
                        example: 'Small to medium businesses'
                    },
                    goToMarket: {
                        type: 'array',
                        items: {
                            type: 'string',
                            enum: ['online_store', 'direct_sales', 'retail', 'subscription', 'freemium', 'marketplace', 'consulting', 'partnerships']
                        },
                        example: ['online_store', 'subscription']
                    },
                    culture: {
                        type: 'string',
                        example: 'Innovative and customer-focused'
                    },
                    userid: {
                        type: 'string',
                        example: 'user123'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time'
                    }
                }
            }
        }
    },
    tags: [
        {
            name: "Authentication",
            description: "Endpoints for user registration, login, and management",
        },
        {
            name: "Workloads",
            description: "Endpoints for managing workloads and tasks within workloads",
        },
        {
            name: "Portfolio",
            description: "Endpoints for managing business portfolios",
        },
    ],
};
const options = {
    definition: swaggerDefinition,
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map