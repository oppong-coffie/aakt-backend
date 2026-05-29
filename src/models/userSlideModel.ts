import { Schema, model, Document, Types } from 'mongoose';

export interface ISlide {
  id: string;
  content: string;
  notes?: string;
  background?: string;
}

export interface IUserSlide extends Document {
  userId: Types.ObjectId | string;
  title: string;
  slides: ISlide[];
  createdAt: Date;
  updatedAt: Date;
}

const userSlideSchema = new Schema<IUserSlide>(
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
    slides: {
      type: Schema.Types.Mixed,
      default: [
        {
          id: '1',
          content: '<h1>Title Slide</h1><p>Welcome to your new presentation</p>',
          background: '#191919'
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

export const UserSlide = model<IUserSlide>('UserSlide', userSlideSchema);
