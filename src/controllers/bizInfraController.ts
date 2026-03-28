import { Request, Response } from 'express';
import { BizInfra } from '../models/bizInfraModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createBizInfraItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { category } = req.params;
        const { name, description, imageUrl } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const newItem = new BizInfra({
            userId,
            category,
            name,
            description,
            imageUrl,
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error creating BizInfra item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
};

export const getBizInfraItems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { category } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const items = await BizInfra.find({ userId, category });
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching BizInfra items:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

export const updateBizInfraItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, imageUrl } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedItem = await BizInfra.findOneAndUpdate(
            { _id: id, userId }, // Ensure user owns the item
            { name, description, imageUrl },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedItem) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating BizInfra item:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
};

export const deleteBizInfraItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const deletedItem = await BizInfra.findOneAndDelete({ _id: id, userId });

        if (!deletedItem) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting BizInfra item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};
