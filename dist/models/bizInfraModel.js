"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BizInfra = void 0;
const mongoose_1 = require("mongoose");
const bizInfraSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', required: true },
    category: {
        type: String,
        enum: ['skillset', 'network', 'intel', 'capital', 'reach'],
        required: true
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String },
}, {
    timestamps: true,
});
// Compound index to ensure fast queries per user and category
bizInfraSchema.index({ userId: 1, category: 1 });
exports.BizInfra = (0, mongoose_1.model)('bizinfra', bizInfraSchema);
//# sourceMappingURL=bizInfraModel.js.map