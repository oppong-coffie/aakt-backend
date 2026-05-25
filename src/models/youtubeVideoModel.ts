import { Schema, model, Document, Types } from 'mongoose';

export interface IYouTubeVideo extends Document {
  userId: Types.ObjectId | string;
  videoId: string;
  title: string;
  addedAt: Date;
}

const youtubeVideoSchema = new Schema<IYouTubeVideo>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users', // Matches 'users' model registration from userModels.ts
      required: true
    },
    videoId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const YouTubeVideo = model<IYouTubeVideo>('YouTubeVideo', youtubeVideoSchema);
