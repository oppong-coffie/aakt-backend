import { Schema, model, Document, Types } from 'mongoose';

export interface IContact extends Document {
    userId: Types.ObjectId;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    avatar?: string;
    imageUrl?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        name: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        email: { type: String, trim: true, lowercase: true },
        phone: { type: String, trim: true },
        avatar: { type: String },
        imageUrl: { type: String },
        bio: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

// Index to ensure fast lookup of contacts belonging to a specific user
contactSchema.index({ userId: 1 });

export const Contact = model<IContact>('contacts', contactSchema);
