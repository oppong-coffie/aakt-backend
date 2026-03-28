import { Request, Response } from 'express';
import { PortfolioItem } from '../models/portfolioModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createPortfolioItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { category } = req.params; // saas or ecommerce
        const { itemType, parentId, name, description, order } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const newItem = new PortfolioItem({
            userId,
            category,
            itemType,
            parentId: parentId || null,
            name,
            description,
            order: order || 0,
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error creating portfolio item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
};

export const getPortfolioItems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { category, itemType } = req.params;
        // Allows filtering by parentId via query string, e.g., ?parentId=123
        const { parentId } = req.query;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const query: any = { userId, category, itemType };
        if (parentId !== undefined) {
            query.parentId = parentId === 'null' ? null : parentId;
        }

        const items = await PortfolioItem.find(query).sort({ order: 1 });
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching portfolio items:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

export const updatePortfolioItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, order, parentId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (order !== undefined) updateData.order = order;
        if (parentId !== undefined) updateData.parentId = parentId === 'null' ? null : parentId;

        const updatedItem = await PortfolioItem.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedItem) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating portfolio item:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
};

export const deletePortfolioItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // We delete the item. Note: cascading deletes for children (e.g., deleting a department 
        // also deletes its operations) could be added here later.
        const deletedItem = await PortfolioItem.findOneAndDelete({ _id: id, userId });

        if (!deletedItem) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting portfolio item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};

export const reorderPortfolioItems = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { items } = req.body; // Expects an array: [{ id: '123', order: 0 }, { id: '456', order: 1 }]
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!Array.isArray(items)) {
            res.status(400).json({ error: 'items must be an array' });
            return;
        }

        // Perform bulk writes to update the order of multiple items
        const results = await Promise.all(
            items.map((item) =>
                PortfolioItem.findOneAndUpdate(
                    { _id: item.id, userId },
                    { order: item.order },
                    { returnDocument: 'after' }
                )
            )
        );

        res.status(200).json(results);
    } catch (error) {
        console.error('Error reordering portfolio items:', error);
        res.status(500).json({ error: 'Failed to reorder items' });
    }
};
