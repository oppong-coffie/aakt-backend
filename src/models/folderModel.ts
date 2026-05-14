import { Schema, model, Document } from 'mongoose';

export interface IFolder extends Document {
  folderName: string;
  userid: string;
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>({
  folderName: { type: String, required: true },
  userid: { type: String, required: true },
}, {
  timestamps: true,
});

export const Folder = model<IFolder>('folders', folderSchema);
