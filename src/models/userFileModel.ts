import { Schema, model, Document, Types } from 'mongoose';

export interface IUserFile extends Document {
  userId: Types.ObjectId | string;
  name: string;
  url: string;
  size?: number;
  type?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userFileSchema = new Schema<IUserFile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number
    },
    type: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const UserFile = model<IUserFile>('UserFile', userFileSchema);
