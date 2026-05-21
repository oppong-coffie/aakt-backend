import { Schema, model, Document } from 'mongoose';

export type AgentActionStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'executed'
  | 'failed';

export interface IAgentAction extends Document {
  actionId: string;
  userId: string;
  conversationId: string;
  toolName: string;
  title: string;
  description: string;
  input: Record<string, unknown>;
  status: AgentActionStatus;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  executedAt?: Date;
}

const agentActionSchema = new Schema<IAgentAction>(
  {
    actionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    conversationId: { type: String, required: true, index: true },
    toolName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    input: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'executed', 'failed'],
      default: 'pending',
      required: true,
      index: true,
    },
    result: { type: Schema.Types.Mixed },
    error: { type: String },
    executedAt: { type: Date },
  },
  { timestamps: true }
);

agentActionSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const AgentAction = model<IAgentAction>(
  'agent_actions',
  agentActionSchema
);
