import swaggerJSDoc from "swagger-jsdoc";

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
      },
      BusinessTask: {
        type: 'object',
        required: ['businessId', 'taskName'],
        properties: {
          businessId: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          taskName: {
            type: 'string',
            example: 'Submit Quarterly Report'
          },
          documents: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Q3 Financials'
                },
                url: {
                  type: 'string',
                  example: 'https://example.com/docs/q3.pdf'
                }
              }
            }
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
    {
      name: "BusinessItems",
      description: "Endpoints for managing business tasks and items",
    },
    {
      name: "BusinessDocuments",
      description: "Endpoints for managing independent business documents",
    },
  ],
};

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);