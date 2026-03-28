import { Schema, model, Document, Types } from 'mongoose';

export interface IBizInfra extends Document {
    userId: Types.ObjectId;
    category: 'skillset' | 'network' | 'intel' | 'capital' | 'reach';
    name: string;
    description?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const bizInfraSchema = new Schema<IBizInfra>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        category: {
            type: String,
            enum: ['skillset', 'network', 'intel', 'capital', 'reach'],
            required: true
        },
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        imageUrl: { type: String },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure fast queries per user and category
bizInfraSchema.index({ userId: 1, category: 1 });

export const BizInfra = model<IBizInfra>('bizinfra', bizInfraSchema);
