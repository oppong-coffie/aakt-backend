import { Response } from 'express';
import { Capital } from '../models/capitalModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createCapitalItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { source, amount, status, geography, thesis, notes } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!source || amount === undefined) {
            res.status(400).json({ error: 'Source and Amount are required' });
            return;
        }

        const newCapital = new Capital({
            userId,
            source,
            amount,
            status: status || 'negotiating',
            geography,
            thesis,
            notes
        });

        const savedCapital = await newCapital.save();
        res.status(201).json(savedCapital);
    } catch (error) {
        console.error('Error creating Capital item:', error);
        res.status(500).json({ error: 'Failed to create capital item' });
    }
};

export const getCapitalItems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const items = await Capital.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching Capital items:', error);
        res.status(500).json({ error: 'Failed to fetch capital items' });
    }
};

export const updateCapitalItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { source, amount, status, geography, thesis, notes } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedItem = await Capital.findOneAndUpdate(
            { _id: id, userId },
            { source, amount, status, geography, thesis, notes },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedItem) {
            res.status(404).json({ error: 'Capital item not found' });
            return;
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating Capital item:', error);
        res.status(500).json({ error: 'Failed to update capital item' });
    }
};

export const deleteCapitalItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const deletedItem = await Capital.findOneAndDelete({ _id: id, userId });

        if (!deletedItem) {
            res.status(404).json({ error: 'Capital item not found' });
            return;
        }

        res.status(200).json({ message: 'Capital item deleted successfully' });
    } catch (error) {
        console.error('Error deleting Capital item:', error);
        res.status(500).json({ error: 'Failed to delete capital item' });
    }
};

export const updateCapitalStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!status) {
            res.status(400).json({ error: 'Status is required' });
            return;
        }

        const updatedItem = await Capital.findOneAndUpdate(
            { _id: id, userId },
            { status },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedItem) {
            res.status(404).json({ error: 'Capital item not found' });
            return;
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating Capital status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};
