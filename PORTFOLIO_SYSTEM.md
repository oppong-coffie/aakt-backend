# Portfolio Management System Documentation

## Overview

The portfolio system is a comprehensive business management framework that captures the complete state of a business including its concept, employees, and hierarchical organizational structure (folders, projects, phases, processes, and blocks).

## System Architecture

### Three Main Sections:

1. **Concept** (`bizConcept`)
   - Business fundamentals and positioning
   - Product, target customer, go-to-market strategy, culture

2. **Employees/Agents** (`agents`)
   - Team members with roles and responsibilities
   - Can be humans, AI, or software

3. **Tree Structure** (`tree`)
   - Hierarchical organizational structure
   - Contains folders, projects, phases, processes, and blocks

---

## API Endpoints

### Portfolio Management

#### Create Portfolio
**POST** `/portfolio`

Request body:
```json
{
  "businessName": "string",
  "bizConcept": {
    "product": "string",
    "customer": "string",
    "goToMarket": ["online_store", "retail"],
    "culture": "string"
  },
  "agents": []
}
```

Response: `201 Created` with portfolio data

#### Get All Portfolios
**GET** `/portfolio`

Response: Array of user's portfolios

#### Get Portfolio by ID
**GET** `/portfolio/:portfolioId`

Response: Single portfolio object

#### Update Portfolio
**PUT** `/portfolio/:portfolioId`

Request body:
```json
{
  "businessName": "string",
  "bizConcept": { ... }
}
```

#### Delete Portfolio
**DELETE** `/portfolio/:portfolioId`

---

### Agent Management

#### Add Agent
**POST** `/portfolio/:portfolioId/agent`

Request body:
```json
{
  "name": "string",
  "kind": "human|ai|software",
  "title": "string",
  "email": "string",
  "timezone": "string"
}
```

#### Remove Agent
**DELETE** `/portfolio/:portfolioId/agent/:agentId`

---

### Tree Node Operations

#### Add Folder
**POST** `/portfolio/:portfolioId/folder`

Request body:
```json
{
  "name": "string",
  "parentId": "uuid|optional"
}
```

#### Add Project
**POST** `/portfolio/:portfolioId/project`

Request body:
```json
{
  "name": "string",
  "parentId": "uuid|optional",
  "reality": {
    "team": [
      {
        "agentId": "uuid",
        "role": "manager|employee"
      }
    ],
    "budget": 50000,
    "timeline": {
      "start": "2026-04-01",
      "finish": "2026-06-01",
      "flexibility": "low|medium|high"
    },
    "constraints": ["string"]
  },
  "goal": {
    "objective": "string",
    "deliverables": ["string"],
    "successMetrics": ["string"],
    "scope": {
      "mustHave": ["string"],
      "niceToHave": ["string"],
      "wontHave": ["string"]
    }
  }
}
```

#### Add Block
**POST** `/portfolio/:portfolioId/block`

Request body:
```json
{
  "name": "string",
  "parentId": "uuid",
  "kind": "document|spreadsheet|database|metric|dashboard|file",
  "contentUrl": "string|optional",
  "summary": "string|optional"
}
```

#### Update Node Permissions
**PUT** `/portfolio/:portfolioId/node/:nodeId/permissions`

Request body:
```json
{
  "permissions": [
    {
      "agentId": "uuid",
      "level": "view|edit|admin"
    }
  ]
}
```

---

## Data Models

### Portfolio
```typescript
{
  _id: ObjectId,
  userId: string,
  businessName: string,
  bizConcept: IBizConcept,
  agents: IAgentInPortfolio[],
  tree: {
    children: (IFolder | IProject | IProcess | IBlock)[]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### BizConcept
```typescript
{
  product: string,
  customer: string,
  goToMarket: string[], // enum values
  culture: string
}
```

### Folder
```typescript
{
  id: string (uuid),
  type: "folder",
  name: string,
  parentId: string,
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string,
  permissions: IPermission[],
  children: (IFolder | IProject | IProcess | IBlock)[]
}
```

### Project
```typescript
{
  id: string (uuid),
  type: "project",
  name: string,
  parentId: string,
  creatdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string,
  permissions: IPermission[],
  reality: IReality,
  goal: IGoal,
  status: "active|paused|complete",
  children: IPhase[]
}
```

### Phase
```typescript
{
  id: string (uuid),
  type: "phase",
  name: string,
  parentId: string,
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string,
  permissions: IPermission[],
  order: number,
  status: "locked|active|complete",
  children: (IFolder | IProcess | IBlock)[]
}
```

### Process
```typescript
{
  id: string (uuid),
  type: "process",
  name: string,
  parentId: string,
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string,
  permissions: IPermission[],
  trigger: "manual|scheduled|automatic",
  schedule: string (cron),
  status: "idle|running|complete|error",
  mode: "predefined|guided|emergent",
  children: ITask[]
}
```

### Task
```typescript
{
  type: "task",
  name: string,
  parentId: string,
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string,
  permissions: IPermission[],
  agentIds: string[],
  status: "pending|running|waiting_feedback|complete|error",
  mode: "predefined|guided|emergent",
  steps: IStep[]
}
```

### Block
```typescript
{
  id: string (uuid),
  type: "block",
  name: string,
  parentId: string,
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string,
  permissions: IPermission[],
  kind: "document|spreadsheet|database|metric|dashboard|file",
  contentUrl: string (optional),
  summary: string (optional)
}
```

### Agent
```typescript
{
  id: string (uuid),
  name: string,
  kind: "human|ai|software",
  title: string,
  email: string,
  timezone: string
}
```

---

## Node Hierarchy

```
Portfolio (root)
├── Folder
│   ├── Folder
│   ├── Project
│   ├── Process
│   └── Block
├── Project
│   └── Phase
│       ├── Folder
│       ├── Process
│       └── Block
├── Process
│   └── Task
│       ├── Command (step)
│       ├── Deliverable (step)
│       └── Feedback (step)
└── Block
```

---

## Go-to-Market Enum Values

- `online_store` - E-commerce store
- `direct_sales` - Direct sales team
- `retail` - Physical retail locations
- `subscription` - Subscription model
- `freemium` - Freemium model
- `marketplace` - Third-party marketplace
- `consulting` - Consulting services
- `partnerships` - Strategic partnerships

---

## Block Types (Kind)

- `document` - Text documents
- `spreadsheet` - Spreadsheets and data tables
- `database` - Database records
- `metric` - KPIs and metrics
- `dashboard` - Visual dashboards
- `file` - General files

---

## Permission Levels

- `view` - Read-only access
- `edit` - View and modify
- `admin` - Full control including permissions

---

## Examples

### Create a Complete Portfolio

```bash
curl -X POST http://localhost:3000/portfolio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "businessName": "DevCo Solutions",
    "bizConcept": {
      "product": "Cloud automation software",
      "customer": "Enterprise companies",
      "goToMarket": ["online_store", "direct_sales"],
      "culture": "Innovation-driven, customer-first"
    },
    "agents": [
      {
        "id": "a1",
        "name": "Alice",
        "kind": "human",
        "title": "Project Manager",
        "email": "alice@devco.com",
        "timezone": "UTC"
      }
    ]
  }'
```

### Add a Project

```bash
curl -X POST http://localhost:3000/portfolio/PORTFOLIO_ID/project \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Q2 Product Launch",
    "reality": {
      "team": [
        {
          "agentId": "a1",
          "role": "manager"
        }
      ],
      "budget": 100000,
      "timeline": {
        "start": "2026-04-01",
        "finish": "2026-06-30",
        "flexibility": "high"
      },
      "constraints": []
    },
    "goal": {
      "objective": "Launch new features to market",
      "deliverables": ["Feature A", "Feature B"],
      "successMetrics": ["50% user adoption", "95% uptime"],
      "scope": {
        "mustHave": ["Feature A"],
        "niceToHave": ["Feature B"],
        "wontHave": ["Legacy support"]
      }
    }
  }'
```

---

## Backend Implementation Files

- `/src/models/portfolioModel.ts` - Complete schema definitions
- `/src/models/agentModel.ts` - Agent schema
- `/src/controllers/portfolioController.ts` - CRUD operations
- `/src/routes/portfolioRoutes.ts` - API endpoints

---

## Future Enhancements

1. **AI Integration** - Convert natural language to schema operations
2. **Process Automation** - Execute processes based on triggers
3. **Real-time Collaboration** - WebSocket updates for team changes
4. **Advanced Permissions** - Row-level security and field-level access control
5. **History Tracking** - Audit trail of all changes
6. **Analytics** - Portfolio health and project insights
