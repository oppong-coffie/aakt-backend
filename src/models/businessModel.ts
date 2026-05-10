import { Schema, model, Document, Types } from 'mongoose';

export interface IDocument {
  name: string;
  url: string;
}

export interface IBusinessTask extends Document {
  businessId: Types.ObjectId | string;
  taskName: string;
  documents: IDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  name: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const businessTaskSchema = new Schema<IBusinessTask>({
  businessId: { type: Schema.Types.Mixed, required: true },
  taskName: { type: String, required: true },
  documents: { type: [documentSchema], default: [] }
}, {
  timestamps: true
});

export const BusinessTask = model<IBusinessTask>('BusinessTask', businessTaskSchema);
