import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { YouTubeVideo } from '../models/youtubeVideoModel';

// 1. GET all videos for the authenticated user
export const getYoutubeVideos = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID not found' });
      return;
    }
    const videos = await YouTubeVideo.find({ userId }).sort({ addedAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// 2. POST a new video
export const addYoutubeVideo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID not found' });
      return;
    }
    const { videoId, title } = req.body;
    if (!videoId || !title) {
      res.status(400).json({ error: 'Video ID and title are required' });
      return;
    }
    
    const newVideo = new YouTubeVideo({
      userId,
      videoId,
      title
    });
    
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// 3. DELETE a video
export const deleteYoutubeVideo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID not found' });
      return;
    }
    const result = await YouTubeVideo.deleteOne({ _id: req.params.id, userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Video not found or unauthorized' });
      return;
    }
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
