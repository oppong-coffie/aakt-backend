"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioItem = void 0;
const mongoose_1 = require("mongoose");
const portfolioItemSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users', required: true },
    itemType: {
        type: String,
        enum: ['department', 'operation', 'project', 'process', 'block'],
        required: true
    },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'portfolio_items', default: null },
    category: { type: String, enum: ['saas', 'ecommerce'], required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
}, {
    timestamps: true,
});
portfolioItemSchema.index({ userId: 1, category: 1, itemType: 1, parentId: 1 });
exports.PortfolioItem = (0, mongoose_1.model)('portfolio_items', portfolioItemSchema);
//# sourceMappingURL=portfolioModel.js.map