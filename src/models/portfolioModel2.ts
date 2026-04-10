import { Schema, model, Document, Types } from 'mongoose';

// Define Permission interface
export interface IPermission {
  agentId: string;
  level: 'view' | 'edit' | 'admin';
}

// Define BizConcept interface
export interface IBizConcept {
  product: string;
  customer: string;
  goToMarket: ('online_store' | 'direct_sales' | 'retail' | 'subscription' | 'freemium' | 'marketplace' | 'consulting' | 'partnerships')[];
  culture: string;
}

// Define Team Member
export interface ITeamMember {
  agentId: string;
  role: 'manager' | 'employee';
}

// Define Timeline
export interface ITimeline {
  start?: Date;
  finish?: Date;
  flexibility: 'low' | 'medium' | 'high';
}

// Define Reality
export interface IReality {
  team: ITeamMember[];
  budget?: number;
  timeline: ITimeline;
  constraints: string[];
}

// Define Scope
export interface IScope {
  mustHave: string[];
  niceToHave: string[];
  wontHave: string[];
}

// Define Goal
export interface IGoal {
  objective?: string;
  deliverables: string[];
  successMetrics: string[];
  scope: IScope;
}

// Define Block
export interface IBlock extends Document {
  id: string;
  type: 'block';
  name: string;
  parentId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  permissions: IPermission[];
  kind: 'document' | 'spreadsheet' | 'database' | 'metric' | 'dashboard' | 'file';
  contentUrl?: string;
  summary?: string;
}

// Define Step (Command, Deliverable, Feedback)
export interface IStep {
  type: 'command' | 'deliverable' | 'feedback';
  content?: string;
  blockId?: string;
  reviewerAgentId?: string;
  onApprove?: string | 'complete';
  onReject?: string;
}

// Define Task
export interface ITask extends Document {
  type: 'task';
  name: string;
  parentId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  permissions: IPermission[];
  agentIds: string[];
  status: 'pending' | 'running' | 'waiting_feedback' | 'complete' | 'error';
  mode: 'predefined' | 'guided' | 'emergent';
  steps: IStep[];
}

// Define Process
export interface IProcess extends Document {
  id: string;
  type: 'process';
  name: string;
  parentId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  permissions: IPermission[];
  trigger: 'manual' | 'scheduled' | 'automatic';
  schedule?: string;
  status: 'idle' | 'running' | 'complete' | 'error';
  mode: 'predefined' | 'guided' | 'emergent';
  children: ITask[];
}

// Define Phase
export interface IPhase extends Document {
  id: string;
  type: 'phase';
  name: string;
  parentId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  permissions: IPermission[];
  order: number;
  status: 'locked' | 'active' | 'complete';
  children: (IFolder | IProject | IProcess | IBlock)[];
}

// Define Project
export interface IProject extends Document {
  id: string;
  type: 'project';
  name: string;
  parentId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  permissions: IPermission[];
  reality: IReality;
  goal: IGoal;
  status: 'active' | 'paused' | 'complete';
  children: IPhase[];
}

// Define Folder
export interface IFolder extends Document {
  id: string;
  type: 'folder';
  name: string;
  parentId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  permissions: IPermission[];
  children: (IFolder | IProject | IProcess | IBlock)[];
}

// Agent interface for portfolio
export interface IAgentInPortfolio {
  id: string;
  name: string;
  kind: 'human' | 'ai' | 'software';
  title: string;
  email: string;
  timezone: string;
}

// Main Portfolio interface
export interface IPortfolio extends Document {
  userId: string;
  businessName: string;
  bizConcept: IBizConcept;
  agents: IAgentInPortfolio[];
  tree: {
    children: (IFolder | IProject | IProcess | IBlock)[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Legacy interface for backward compatibility
export interface IPortfolioItem extends Document {
    userId: Types.ObjectId;
    itemType: 'department' | 'operation' | 'project' | 'process' | 'block';
    parentId?: Types.ObjectId;
    category: 'saas' | 'ecommerce' | 'business';
    name: string;
    description?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

// Schemas
const permissionSchema = new Schema<IPermission>(
  {
    agentId: { type: String, required: true },
    level: { type: String, enum: ['view', 'edit', 'admin'], default: 'view' },
  },
  { _id: false }
);

const bizConceptSchema = new Schema<IBizConcept>(
  {
    product: { type: String, required: true },
    customer: { type: String, required: true },
    goToMarket: {
      type: [String],
      enum: ['online_store', 'direct_sales', 'retail', 'subscription', 'freemium', 'marketplace', 'consulting', 'partnerships'],
      required: true,
    },
    culture: { type: String, required: true },
  },
  { _id: false }
);

const teamMemberSchema = new Schema<ITeamMember>(
  {
    agentId: { type: String, required: true },
    role: { type: String, enum: ['manager', 'employee'], required: true },
  },
  { _id: false }
);

const timelineSchema = new Schema<ITimeline>(
  {
    start: { type: Date },
    finish: { type: Date },
    flexibility: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  },
  { _id: false }
);

const realitySchema = new Schema<IReality>(
  {
    team: [teamMemberSchema],
    budget: { type: Number },
    timeline: { type: timelineSchema, required: true },
    constraints: { type: [String], default: [] },
  },
  { _id: false }
);

const scopeSchema = new Schema<IScope>(
  {
    mustHave: { type: [String], default: [] },
    niceToHave: { type: [String], default: [] },
    wontHave: { type: [String], default: [] },
  },
  { _id: false }
);

const goalSchema = new Schema<IGoal>(
  {
    objective: { type: String },
    deliverables: { type: [String], default: [] },
    successMetrics: { type: [String], default: [] },
    scope: { type: scopeSchema, required: true },
  },
  { _id: false }
);

const stepSchema = new Schema(
  {
    type: { type: String, enum: ['command', 'deliverable', 'feedback'], required: true },
    content: { type: String },
    blockId: { type: String },
    reviewerAgentId: { type: String },
    onApprove: { type: String },
    onReject: { type: String },
  },
  { _id: false }
);

const taskSchema = new Schema<ITask>(
  {
    type: { type: String, default: 'task' },
    name: { type: String, required: true },
    parentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String, required: true },
    permissions: [permissionSchema],
    agentIds: { type: [String], default: [] },
    status: { 
      type: String, 
      enum: ['pending', 'running', 'waiting_feedback', 'complete', 'error'], 
      default: 'pending' 
    },
    mode: { type: String, enum: ['predefined', 'guided', 'emergent'], default: 'predefined' },
    steps: [stepSchema],
  },
  { _id: false }
);

const blockSchema = new Schema<IBlock>(
  {
    id: { type: String, required: true },
    type: { type: String, default: 'block' },
    name: { type: String, required: true },
    parentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String, required: true },
    permissions: [permissionSchema],
    kind: { 
      type: String, 
      enum: ['document', 'spreadsheet', 'database', 'metric', 'dashboard', 'file'], 
      required: true 
    },
    contentUrl: { type: String },
    summary: { type: String },
  },
  { _id: false }
);

const processSchema = new Schema<IProcess>(
  {
    id: { type: String, required: true },
    type: { type: String, default: 'process' },
    name: { type: String, required: true },
    parentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String, required: true },
    permissions: [permissionSchema],
    trigger: { type: String, enum: ['manual', 'scheduled', 'automatic'], default: 'manual' },
    schedule: { type: String },
    status: { type: String, enum: ['idle', 'running', 'complete', 'error'], default: 'idle' },
    mode: { type: String, enum: ['predefined', 'guided', 'emergent'], default: 'predefined' },
    children: [taskSchema],
  },
  { _id: false }
);

const phaseSchema = new Schema<IPhase>(
  {
    id: { type: String, required: true },
    type: { type: String, default: 'phase' },
    name: { type: String, required: true },
    parentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String, required: true },
    permissions: [permissionSchema],
    order: { type: Number, required: true },
    status: { type: String, enum: ['locked', 'active', 'complete'], default: 'active' },
    children: { type: Schema.Types.Mixed, default: [] },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true },
    type: { type: String, default: 'project' },
    name: { type: String, required: true },
    parentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String, required: true },
    permissions: [permissionSchema],
    reality: { type: realitySchema, required: true },
    goal: { type: goalSchema, required: true },
    status: { type: String, enum: ['active', 'paused', 'complete'], default: 'active' },
    children: [phaseSchema],
  },
  { _id: false }
);

const folderSchema = new Schema<IFolder>(
  {
    id: { type: String, required: true },
    type: { type: String, default: 'folder' },
    name: { type: String, required: true },
    parentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String, required: true },
    permissions: [permissionSchema],
    children: { type: Schema.Types.Mixed, default: [] },
  },
  { _id: false }
);

const agentInPortfolioSchema = new Schema<IAgentInPortfolio>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    kind: { type: String, enum: ['human', 'ai', 'software'], required: true },
    title: { type: String, required: true },
    email: { type: String, required: true },
    timezone: { type: String, default: 'UTC' },
  },
  { _id: false }
);

const portfolioSchema = new Schema<IPortfolio>(
  {
    userId: { type: String, required: true, index: true },
    businessName: { type: String, required: true },
    bizConcept: { type: bizConceptSchema, required: true },
    agents: [agentInPortfolioSchema],
    tree: {
      children: { type: Schema.Types.Mixed, default: [] },
    },
  },
  { timestamps: true }
);

// Legacy schema for backward compatibility
const portfolioItemSchema = new Schema<IPortfolioItem>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        itemType: {
            type: String,
            enum: ['department', 'operation', 'project', 'process', 'block'],
            required: true
        },
        parentId: { type: Schema.Types.ObjectId, ref: 'portfolio_items', default: null },
        category: { type: String, enum: ['saas', 'ecommerce', 'business'], required: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        order: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

portfolioItemSchema.index({ userId: 1, category: 1, itemType: 1, parentId: 1 });

export const Portfolio = model<IPortfolio>('portfolios', portfolioSchema);
export const PortfolioItem = model<IPortfolioItem>('portfolio_items', portfolioItemSchema);
