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
      url: "https://aakt-backend-production.up.railway.app",
      description: "Production server",
    },
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
      },
      Contact: {
        type: 'object',
        required: ['name', 'role'],
        properties: {
          _id: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          name: {
            type: 'string',
            example: 'Bessie Cooper'
          },
          role: {
            type: 'string',
            example: 'Web Designer'
          },
          email: {
            type: 'string',
            example: 'bessie.cooper@example.com'
          },
          phone: {
            type: 'string',
            example: '+1 (555) 001-0203'
          },
          avatar: {
            type: 'string',
            example: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bessie'
          },
          imageUrl: {
            type: 'string',
            example: 'https://firebasestorage.googleapis.com/v0/b/...'
          },
          bio: {
            type: 'string',
            example: 'Passionate web designer...'
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
      Capital: {
        type: 'object',
        required: ['source', 'amount'],
        properties: {
          _id: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          source: {
            type: 'string',
            example: 'VC Fund A'
          },
          amount: {
            type: 'number',
            example: 500000
          },
          status: {
            type: 'string',
            example: 'negotiating'
          },
          geography: {
            type: 'string',
            example: 'North America'
          },
          thesis: {
            type: 'string',
            example: 'Early stage SaaS'
          },
          notes: {
            type: 'string',
            example: 'Met at conference'
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
      UserFile: {
        type: 'object',
        required: ['name', 'url'],
        properties: {
          _id: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          userId: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          name: {
            type: 'string',
            example: 'report.pdf'
          },
          url: {
            type: 'string',
            example: 'https://firebasestorage.googleapis.com/v0/b/blaccbook-dev.appspot.com/o/...'
          },
          type: {
            type: 'string',
            example: 'application/pdf'
          },
          size: {
            type: 'number',
            example: 204800
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
      UserDocument: {
        type: 'object',
        required: ['title'],
        properties: {
          _id: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          userId: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          title: {
            type: 'string',
            example: 'Meeting Notes'
          },
          content: {
            type: 'string',
            example: 'Discussion points from the Q3 planning session...'
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
      UserWhiteboard: {
        type: 'object',
        required: ['title'],
        properties: {
          _id: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          userId: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          title: {
            type: 'string',
            example: 'Brainstorming Session'
          },
          elements: {
            type: 'array',
            items: {
              type: 'object'
            },
            description: 'Canvas elements (shapes, text, drawings, etc.)',
            example: []
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
      BizInfra: {
        type: 'object',
        required: ['category', 'name'],
        properties: {
          _id: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          userId: {
            type: 'string',
            example: '60d21b4667d0d8992e610c85'
          },
          category: {
            type: 'string',
            enum: ['skillset', 'network', 'intel', 'capital', 'reach'],
            example: 'skillset'
          },
          name: {
            type: 'string',
            example: 'AWS Cloud Infrastructure'
          },
          description: {
            type: 'string',
            example: 'Cloud hosting and computing resources'
          },
          imageUrl: {
            type: 'string',
            example: 'https://example.com/aws-logo.png'
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
      AgentAction: {
        type: 'object',
        properties: {
          actionId: {
            type: 'string',
            example: 'act_abc123'
          },
          conversationId: {
            type: 'string',
            example: 'conv_abc123'
          },
          toolName: {
            type: 'string',
            example: 'create_folder'
          },
          title: {
            type: 'string',
            example: 'Create folder Marketing'
          },
          description: {
            type: 'string',
            example: 'Creates a new folder named Marketing'
          },
          input: {
            type: 'object',
            description: 'Tool-specific input parameters'
          },
          status: {
            type: 'string',
            enum: ['pending', 'approved', 'rejected', 'executed', 'failed'],
            example: 'pending'
          },
          result: {
            type: 'object',
            description: 'Execution result (present after execution)'
          },
          error: {
            type: 'string',
            description: 'Error message (present if failed)'
          },
          executedAt: {
            type: 'string',
            format: 'date-time'
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
    {
      name: "Folders",
      description: "Endpoints for managing folders",
    },
    {
      name: "Admin",
      description: "Endpoints for admin registration, login, and management",
    },
    {
      name: "Contacts",
      description: "Endpoints for managing user connections/contacts",
    },
    {
      name: "Capital",
      description: "Endpoints for managing capital details and statuses",
    },
    {
      name: "Files",
      description: "Endpoints for uploading and managing user files",
    },
    {
      name: "Documents",
      description: "Endpoints for managing user documents (rich text notes)",
    },
    {
      name: "Whiteboards",
      description: "Endpoints for managing user whiteboards",
    },
    {
      name: "Agent",
      description: "Endpoints for interacting with the AI agent (chat, actions, conversations)",
    },
    {
      name: "BizInfra",
      description: "Endpoints for managing business infrastructure items across categories",
    },
  ],
};

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);