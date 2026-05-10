import { Schema, model, Document, Types } from 'mongoose';

export interface IBusinessDocument extends Document {
  businessId: Types.ObjectId | string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const businessDocumentSchema = new Schema<IBusinessDocument>({
  businessId: { type: Schema.Types.Mixed, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true }
}, {
  timestamps: true
});

export const BusinessDocument = model<IBusinessDocument>('BusinessDocument', businessDocumentSchema);
