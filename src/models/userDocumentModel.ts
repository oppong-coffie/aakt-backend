import { Schema, model, Document, Types } from 'mongoose';

export interface IUserDocument extends Document {
  userId: Types.ObjectId | string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const userDocumentSchema = new Schema<IUserDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users', // Matches 'users' model registration from userModels.ts
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const UserDocument = model<IUserDocument>('UserDocument', userDocumentSchema);
