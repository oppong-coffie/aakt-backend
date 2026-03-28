"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderPortfolioItems = exports.deletePortfolioItem = exports.updatePortfolioItem = exports.getPortfolioItems = exports.createPortfolioItem = void 0;
const portfolioModel_1 = require("../models/portfolioModel");
const createPortfolioItem = async (req, res) => {
    try {
        const { category } = req.params; // saas or ecommerce
        const { itemType, parentId, name, description, order } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const newItem = new portfolioModel_1.PortfolioItem({
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
    }
    catch (error) {
        console.error('Error creating portfolio item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
};
exports.createPortfolioItem = createPortfolioItem;
const getPortfolioItems = async (req, res) => {
    try {
        const { category, itemType } = req.params;
        // Allows filtering by parentId via query string, e.g., ?parentId=123
        const { parentId } = req.query;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const query = { userId, category, itemType };
        if (parentId !== undefined) {
            query.parentId = parentId === 'null' ? null : parentId;
        }
        const items = await portfolioModel_1.PortfolioItem.find(query).sort({ order: 1 });
        res.status(200).json(items);
    }
    catch (error) {
        console.error('Error fetching portfolio items:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};
exports.getPortfolioItems = getPortfolioItems;
const updatePortfolioItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, order, parentId } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (order !== undefined)
            updateData.order = order;
        if (parentId !== undefined)
            updateData.parentId = parentId === 'null' ? null : parentId;
        const updatedItem = await portfolioModel_1.PortfolioItem.findOneAndUpdate({ _id: id, userId }, updateData, { returnDocument: 'after', runValidators: true });
        if (!updatedItem) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        res.status(200).json(updatedItem);
    }
    catch (error) {
        console.error('Error updating portfolio item:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
};
exports.updatePortfolioItem = updatePortfolioItem;
const deletePortfolioItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // We delete the item. Note: cascading deletes for children (e.g., deleting a department 
        // also deletes its operations) could be added here later.
        const deletedItem = await portfolioModel_1.PortfolioItem.findOneAndDelete({ _id: id, userId });
        if (!deletedItem) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting portfolio item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};
exports.deletePortfolioItem = deletePortfolioItem;
const reorderPortfolioItems = async (req, res) => {
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
        const results = await Promise.all(items.map((item) => portfolioModel_1.PortfolioItem.findOneAndUpdate({ _id: item.id, userId }, { order: item.order }, { returnDocument: 'after' })));
        res.status(200).json(results);
    }
    catch (error) {
        console.error('Error reordering portfolio items:', error);
        res.status(500).json({ error: 'Failed to reorder items' });
    }
};
exports.reorderPortfolioItems = reorderPortfolioItems;
//# sourceMappingURL=portfolioController.js.map