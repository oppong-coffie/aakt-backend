import { Schema, model, Document, Types } from 'mongoose';

export interface IUserWhiteboard extends Document {
  userId: Types.ObjectId | string;
  title: string;
  elements: any[];
  createdAt: Date;
  updatedAt: Date;
}

const userWhiteboardSchema = new Schema<IUserWhiteboard>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    elements: {
      type: Schema.Types.Mixed,
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const UserWhiteboard = model<IUserWhiteboard>('UserWhiteboard', userWhiteboardSchema);
