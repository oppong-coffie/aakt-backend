"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Done'],
        default: 'In Progress'
    },
    assignee: { type: String, trim: true },
    portfolioItemId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'portfolio_items' },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'tasks' },
}, {
    timestamps: true,
});
taskSchema.index({ userId: 1, portfolioItemId: 1 });
taskSchema.index({ parentId: 1 });
exports.Task = (0, mongoose_1.model)('tasks', taskSchema);
//# sourceMappingURL=taskModel.js.map