import { Schema, model, Document } from 'mongoose';

export type AgentMessageRole = 'user' | 'assistant' | 'system';

export interface IAgentMessage {
  role: AgentMessageRole;
  content: string;
  actionIds?: string[];
  createdAt: Date;
}

export interface IAgentConversation extends Document {
  conversationId: string;
  userId: string;
  title: string;
  messages: IAgentMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const agentMessageSchema = new Schema<IAgentMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: { type: String, required: true },
    actionIds: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const agentConversationSchema = new Schema<IAgentConversation>(
  {
    conversationId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, default: 'New chat' },
    messages: { type: [agentMessageSchema], default: [] },
  },
  { timestamps: true }
);

agentConversationSchema.index({ userId: 1, updatedAt: -1 });

export const AgentConversation = model<IAgentConversation>(
  'agent_conversations',
  agentConversationSchema
);
