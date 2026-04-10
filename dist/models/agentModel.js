"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const mongoose_1 = require("mongoose");
const agentSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    kind: {
        type: String,
        enum: ['human', 'ai', 'software'],
        required: true
    },
    title: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    timezone: { type: String, default: 'UTC' },
    businessId: { type: String, required: true },
}, { timestamps: true });
exports.Agent = (0, mongoose_1.model)('agents', agentSchema);
//# sourceMappingURL=agentModel.js.map