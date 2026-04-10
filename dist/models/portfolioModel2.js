"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioItem = exports.Portfolio = void 0;
const mongoose_1 = require("mongoose");
// Schemas
const permissionSchema = new mongoose_1.Schema({
    agentId: { type: String, required: true },
    level: { type: String, enum: ['view', 'edit', 'admin'], default: 'view' },
}, { _id: false });
const bizConceptSchema = new mongoose_1.Schema({
    product: { type: String, required: true },
    customer: { type: String, required: true },
    goToMarket: {
        type: [String],
        enum: ['online_store', 'direct_sales', 'retail', 'subscription', 'freemium', 'marketplace', 'consulting', 'partnerships'],
        required: true,
    },
    culture: { type: String, required: true },
}, { _id: false });
const teamMemberSchema = new mongoose_1.Schema({
    agentId: { type: String, required: true },
    role: { type: String, enum: ['manager', 'employee'], required: true },
}, { _id: false });
const timelineSchema = new mongoose_1.Schema({
    start: { type: Date },
    finish: { type: Date },
    flexibility: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
}, { _id: false });
const realitySchema = new mongoose_1.Schema({
    team: [teamMemberSchema],
    budget: { type: Number },
    timeline: { type: timelineSchema, required: true },
    constraints: { type: [String], default: [] },
}, { _id: false });
const scopeSchema = new mongoose_1.Schema({
    mustHave: { type: [String], default: [] },
    niceToHave: { type: [String], default: [] },
    wontHave: { type: [String], default: [] },
}, { _id: false });
const goalSchema = new mongoose_1.Schema({
    objective: { type: String },
    deliverables: { type: [String], default: [] },
    successMetrics: { type: [String], default: [] },
    scope: { type: scopeSchema, required: true },
}, { _id: false });
const stepSchema = new mongoose_1.Schema({
    type: { type: String, enum: ['command', 'deliverable', 'feedback'], required: true },
    content: { type: String },
    blockId: { type: String },
    reviewerAgentId: { type: String },
    onApprove: { type: String },
    onReject: { type: String },
}, { _id: false });
const taskSchema = new mongoose_1.Schema({
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
}, { _id: false });
const blockSchema = new mongoose_1.Schema({
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
}, { _id: false });
const processSchema = new mongoose_1.Schema({
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
}, { _id: false });
const phaseSchema = new mongoose_1.Schema({
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
    children: { type: mongoose_1.Schema.Types.Mixed, default: [] },
}, { _id: false });
const projectSchema = new mongoose_1.Schema({
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
}, { _id: false });
const folderSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    type: { type: String, default: 'folder' },
    name: { type: String, required: true },
    parentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String, required: true },
    permissions: [permissionSchema],
    children: { type: mongoose_1.Schema.Types.Mixed, default: [] },
}, { _id: false });
const agentInPortfolioSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    kind: { type: String, enum: ['human', 'ai', 'software'], required: true },
    title: { type: String, required: true },
    email: { type: String, required: true },
    timezone: { type: String, default: 'UTC' },
}, { _id: false });
const portfolioSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    businessName: { type: String, required: true },
    bizConcept: { type: bizConceptSchema, required: true },
    agents: [agentInPortfolioSchema],
    tree: {
        children: { type: mongoose_1.Schema.Types.Mixed, default: [] },
    },
}, { timestamps: true });
// Legacy schema for backward compatibility
const portfolioItemSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', required: true },
    itemType: {
        type: String,
        enum: ['department', 'operation', 'project', 'process', 'block'],
        required: true
    },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'portfolio_items', default: null },
    category: { type: String, enum: ['saas', 'ecommerce', 'business'], required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
}, {
    timestamps: true,
});
portfolioItemSchema.index({ userId: 1, category: 1, itemType: 1, parentId: 1 });
exports.Portfolio = (0, mongoose_1.model)('portfolios', portfolioSchema);
exports.PortfolioItem = (0, mongoose_1.model)('portfolio_items', portfolioItemSchema);
//# sourceMappingURL=portfolioModel2.js.map