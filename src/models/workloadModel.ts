import { Schema, model, Document, Types } from 'mongoose';

export interface IWorkload extends Document {
  userid: Types.ObjectId;
  workloadname: string;
  status: string;
  tasks: {
    taskname: string;
    status: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const workloadSchema = new Schema<IWorkload>(
  {
    userid: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    workloadname: { type: String, required: true, trim: true },
    status: { type: String, default: 'Pending' },
    tasks: [
      {
        taskname: { type: String, required: true },
        status: { type: String, default: 'Todo' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Workload = model<IWorkload>('workloads', workloadSchema);
