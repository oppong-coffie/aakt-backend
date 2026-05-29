import { Response } from 'express';
import { UserWhiteboard } from '../models/userWhiteboardModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createWhiteboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { title, elements } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!title) {
            res.status(400).json({ error: 'Title is required' });
            return;
        }

        const newWhiteboard = new UserWhiteboard({
            userId,
            title,
            elements: elements || []
        });

        const savedWhiteboard = await newWhiteboard.save();
        res.status(201).json(savedWhiteboard);
    } catch (error) {
        console.error('Error creating Whiteboard:', error);
        res.status(500).json({ error: 'Failed to create whiteboard' });
    }
};

export const getWhiteboards = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const whiteboards = await UserWhiteboard.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json(whiteboards);
    } catch (error) {
        console.error('Error fetching Whiteboards:', error);
        res.status(500).json({ error: 'Failed to fetch whiteboards' });
    }
};

export const updateWhiteboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, elements } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedWhiteboard = await UserWhiteboard.findOneAndUpdate(
            { _id: id, userId },
            { title, elements },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedWhiteboard) {
            res.status(404).json({ error: 'Whiteboard not found' });
            return;
        }

        res.status(200).json(updatedWhiteboard);
    } catch (error) {
        console.error('Error updating Whiteboard:', error);
        res.status(500).json({ error: 'Failed to update whiteboard' });
    }
};

export const deleteWhiteboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const deletedWhiteboard = await UserWhiteboard.findOneAndDelete({ _id: id, userId });

        if (!deletedWhiteboard) {
            res.status(404).json({ error: 'Whiteboard not found' });
            return;
        }

        res.status(200).json({ message: 'Whiteboard deleted successfully' });
    } catch (error) {
        console.error('Error deleting Whiteboard:', error);
        res.status(500).json({ error: 'Failed to delete whiteboard' });
    }
};
