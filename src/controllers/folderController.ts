import { Request, Response } from 'express';
import { Folder } from '../models/folderModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// START:: Create a new Folder
export const createFolder = async (req: Request, res: Response): Promise<void> => {
    const { folderName } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!folderName) {
        res.status(400).json({ error: 'folderName is required.' });
        return;
    }

    try {
        const folder = new Folder({
            folderName,
            userid: userId,
        });

        const saved = await folder.save();
        res.status(201).json({ message: 'Folder created successfully', data: saved });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Create a new Folder

// START:: Get all Folders
export const getFolders = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    try {
        const folders = await Folder.find({ userid: userId }).sort({ createdAt: -1 });
        res.status(200).json({ data: folders });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Get all Folders

// START:: Get Folder by ID
export const getFolderById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = (req as AuthenticatedRequest).user?.id;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: token required' });
        return;
    }

    if (!id) {
        res.status(400).json({ error: 'Folder ID is required.' });
        return;
    }

    try {
        const folder = await Folder.findOne({ _id: id, userid: userId });

        if (!folder) {
            res.status(404).json({ error: 'Folder not found' });
            return;
        }

        res.status(200).json({ data: folder });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
// END:: Get Folder by ID
