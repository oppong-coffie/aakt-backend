import { Schema, model, Document } from 'mongoose';

export interface IBusiness extends Document {
  businessName: string;
  product?: string;
  customer?: string;
  goToMarket?: ('online_store' | 'direct_sales' | 'retail' | 'subscription' | 'freemium' | 'marketplace' | 'consulting' | 'partnerships')[];
  culture?: string;
  businessImage?: string;
  userid: string;
  createdAt: Date;
  updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>({
  businessName: { type: String, required: true },
  product: { type: String },
  customer: { type: String },
  goToMarket: {
    type: [String],
    enum: ['online_store', 'direct_sales', 'retail', 'subscription', 'freemium', 'marketplace', 'consulting', 'partnerships'],
    default: []
  },
  culture: { type: String },
  businessImage: { type: String },
  userid: { type: String, required: true },
}, {
  timestamps: true,
});

export const Business = model<IBusiness>('businesses', businessSchema);

export interface IProject extends Document {
  businessId: string;
  projectName: string;
  projectDescription?: string;
  userid: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  businessId: { type: String, required: true },
  projectName: { type: String, required: true },
  projectDescription: { type: String },
  userid: { type: String, required: true },
}, {
  timestamps: true,
});

export const Project = model<IProject>('projects', projectSchema);

export interface ITask {
  _id?: string;
  taskName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const taskSchema = new Schema<ITask>({
  taskName: { type: String, required: true },
}, {
  timestamps: true,
});

export interface IPhase extends Document {
  projectId: string;
  phaseName: string;
  phaseDescription?: string;
  userid: string;
  createdAt: Date;
  updatedAt: Date;
}

const phaseSchema = new Schema<IPhase>({
  projectId: { type: String, required: true },
  phaseName: { type: String, required: true },
  phaseDescription: { type: String },
  userid: { type: String, required: true },
}, {
  timestamps: true,
});

export const Phase = model<IPhase>('phases', phaseSchema);

export interface IProcess extends Document {
  businessId: string;
  projectId: string;
  phaseId: string;
  processName: string;
  tasks: ITask[];
  userid: string;
  createdAt: Date;
  updatedAt: Date;
}

const processSchema = new Schema<IProcess>({
  businessId: { type: String, required: true },
  projectId: { type: String, required: true },
  phaseId: { type: String, required: true },
  processName: { type: String, required: true },
  tasks: { type: [taskSchema], default: [] },
  userid: { type: String, required: true },
}, {
  timestamps: true,
});

export const ProcessModel = model<IProcess>('processes', processSchema);