import { Schema, model, Document } from 'mongoose';

export interface IAgent extends Document {
  id: string;
  name: string;
  kind: 'human' | 'ai' | 'software';
  title: string;
  email: string;
  timezone: string;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

const agentSchema = new Schema<IAgent>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    kind: { 
      type: String, 
      enum: ['human', 'ai', 'software'], 
      required: true 
    },
    title: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    timezone: { type: String, default: 'UTC' },
    businessId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Agent = model<IAgent>('agents', agentSchema);
