import { Schema, model, Document, Types } from 'mongoose';

// Base interface for all portfolio items
export interface IPortfolioItem extends Document {
    userId: Types.ObjectId;
    itemType: 'department' | 'operation' | 'project' | 'process' | 'block';
    parentId?: Types.ObjectId; // null for departments, otherwise points to the parent item
    category: 'saas' | 'ecommerce';
    name: string;
    description?: string;
    order: number; // For drag and drop reordering
    createdAt: Date;
    updatedAt: Date;
}

const portfolioItemSchema = new Schema<IPortfolioItem>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        itemType: {
            type: String,
            enum: ['department', 'operation', 'project', 'process', 'block'],
            required: true
        },
        parentId: { type: Schema.Types.ObjectId, ref: 'portfolio_items', default: null },
        category: { type: String, enum: ['saas', 'ecommerce'], required: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        order: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

portfolioItemSchema.index({ userId: 1, category: 1, itemType: 1, parentId: 1 });

export const PortfolioItem = model<IPortfolioItem>('portfolio_items', portfolioItemSchema);
