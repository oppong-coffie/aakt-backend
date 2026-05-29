import { Schema, model, Document, Types } from 'mongoose';

export interface ICapital extends Document {
    userId: Types.ObjectId;
    source: string;
    amount: number;
    status: string;
    geography?: string;
    thesis?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const capitalSchema = new Schema<ICapital>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        source: { type: String, required: true, trim: true },
        amount: { type: Number, required: true },
        status: { type: String, required: true, trim: true, default: 'negotiating' },
        geography: { type: String, trim: true },
        thesis: { type: String, trim: true },
        notes: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

// Index to ensure fast querying of capital items per user
capitalSchema.index({ userId: 1 });

export const Capital = model<ICapital>('capitals', capitalSchema);
