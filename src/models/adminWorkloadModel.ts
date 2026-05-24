import { Schema, model, Document } from 'mongoose';

export interface IAdminWorkload extends Document {
  name: string;
  tasks: {
    name: string;
    status: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const adminWorkloadSchema = new Schema<IAdminWorkload>(
  {
    name: { type: String, required: true, trim: true },
    tasks: [
      {
        name: { type: String, required: true },
        status: { type: String, default: 'Todo' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const AdminWorkload = model<IAdminWorkload>('adminworkloads', adminWorkloadSchema);
