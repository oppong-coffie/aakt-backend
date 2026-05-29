import { Response } from 'express';
import { UserFile } from '../models/userFileModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { name, url, size, type } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!name) {
            res.status(400).json({ error: 'Name is required' });
            return;
        }

        if (!url) {
            res.status(400).json({ error: 'URL is required' });
            return;
        }

        const newFile = new UserFile({
            userId,
            name,
            url,
            size,
            type
        });

        const savedFile = await newFile.save();
        res.status(201).json(savedFile);
    } catch (error) {
        console.error('Error creating UserFile:', error);
        res.status(500).json({ error: 'Failed to create file record' });
    }
};

export const getFiles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log('[getFiles] Request received. Decoded user:', req.user);
    try {
        const userId = req.user?.id;

        if (!userId) {
            console.log('[getFiles] Unauthorized: No userId present in token');
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        console.log('[getFiles] Querying UserFile for userId:', userId);
        const files = await UserFile.find({ userId }).sort({ updatedAt: -1 });
        console.log('[getFiles] Query successful. Found files count:', files.length);
        res.status(200).json(files);
    } catch (error) {
        console.error('[getFiles] Error fetching UserFiles:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
};

export const updateFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, url, size, type } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedFile = await UserFile.findOneAndUpdate(
            { _id: id, userId },
            { name, url, size, type },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedFile) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        res.status(200).json(updatedFile);
    } catch (error) {
        console.error('Error updating UserFile:', error);
        res.status(500).json({ error: 'Failed to update file record' });
    }
};

export const deleteFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const deletedFile = await UserFile.findOneAndDelete({ _id: id, userId });

        if (!deletedFile) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting UserFile:', error);
        res.status(500).json({ error: 'Failed to delete file record' });
    }
};
