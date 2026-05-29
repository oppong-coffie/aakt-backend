import { Schema, model, Document, Types } from 'mongoose';

export interface IUserSpreadsheet extends Document {
  userId: Types.ObjectId | string;
  title: string;
  workbookData: any;
  createdAt: Date;
  updatedAt: Date;
}

const userSpreadsheetSchema = new Schema<IUserSpreadsheet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    workbookData: {
      type: Schema.Types.Mixed,
      default: {
        id: 'workbook-default',
        locale: 'enUS',
        name: 'Untitled Spreadsheet',
        sheets: {
          'sheet-1': {
            id: 'sheet-1',
            name: 'Sheet1',
            rowCount: 100,
            columnCount: 20,
            cellData: {}
          }
        }
      }
    }
  },
  {
    timestamps: true
  }
);

export const UserSpreadsheet = model<IUserSpreadsheet>('UserSpreadsheet', userSpreadsheetSchema);
