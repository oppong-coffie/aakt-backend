"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessModel = exports.Phase = exports.Project = exports.Business = void 0;
const mongoose_1 = require("mongoose");
const businessSchema = new mongoose_1.Schema({
    businessName: { type: String, required: true },
    product: { type: String },
    customer: { type: String },
    goToMarket: {
        type: [String],
        enum: ['online_store', 'direct_sales', 'retail', 'subscription', 'freemium', 'marketplace', 'consulting', 'partnerships'],
        default: []
    },
    culture: { type: String },
    businessImage: { type: String },
    userid: { type: String, required: true },
}, {
    timestamps: true,
});
exports.Business = (0, mongoose_1.model)('businesses', businessSchema);
const projectSchema = new mongoose_1.Schema({
    businessId: { type: String, required: true },
    projectName: { type: String, required: true },
    projectDescription: { type: String },
    userid: { type: String, required: true },
}, {
    timestamps: true,
});
exports.Project = (0, mongoose_1.model)('projects', projectSchema);
const taskSchema = new mongoose_1.Schema({
    taskName: { type: String, required: true },
}, {
    timestamps: true,
});
const phaseSchema = new mongoose_1.Schema({
    projectId: { type: String, required: true },
    phaseName: { type: String, required: true },
    phaseDescription: { type: String },
    userid: { type: String, required: true },
}, {
    timestamps: true,
});
exports.Phase = (0, mongoose_1.model)('phases', phaseSchema);
const processSchema = new mongoose_1.Schema({
    businessId: { type: String, required: true },
    projectId: { type: String, required: true },
    phaseId: { type: String, required: true },
    processName: { type: String, required: true },
    tasks: { type: [taskSchema], default: [] },
    userid: { type: String, required: true },
}, {
    timestamps: true,
});
exports.ProcessModel = (0, mongoose_1.model)('processes', processSchema);
//# sourceMappingURL=portfolioModel.js.map