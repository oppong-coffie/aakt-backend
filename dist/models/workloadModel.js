"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workload = void 0;
const mongoose_1 = require("mongoose");
const workloadSchema = new mongoose_1.Schema({
    userid: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', required: true },
    workloadname: { type: String, required: true, trim: true },
    status: { type: String, default: 'Pending' },
    tasks: [
        {
            taskname: { type: String, required: true },
            status: { type: String, default: 'Todo' },
        },
    ],
}, {
    timestamps: true,
});
exports.Workload = (0, mongoose_1.model)('workloads', workloadSchema);
//# sourceMappingURL=workloadModel.js.map