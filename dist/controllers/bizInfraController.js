"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBizInfraItem = exports.updateBizInfraItem = exports.getBizInfraItems = exports.createBizInfraItem = void 0;
const bizInfraModel_1 = require("../models/bizInfraModel");
const createBizInfraItem = async (req, res) => {
    try {
        const { category } = req.params;
        const { name, description, imageUrl } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const newItem = new bizInfraModel_1.BizInfra({
            userId,
            category,
            name,
            description,
            imageUrl,
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    }
    catch (error) {
        console.error('Error creating BizInfra item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
};
exports.createBizInfraItem = createBizInfraItem;
const getBizInfraItems = async (req, res) => {
    try {
        const { category } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const items = await bizInfraModel_1.BizInfra.find({ userId, category });
        res.status(200).json(items);
    }
    catch (error) {
        console.error('Error fetching BizInfra items:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};
exports.getBizInfraItems = getBizInfraItems;
const updateBizInfraItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, imageUrl } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const updatedItem = await bizInfraModel_1.BizInfra.findOneAndUpdate({ _id: id, userId }, // Ensure user owns the item
        { name, description, imageUrl }, { returnDocument: 'after', runValidators: true });
        if (!updatedItem) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        res.status(200).json(updatedItem);
    }
    catch (error) {
        console.error('Error updating BizInfra item:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
};
exports.updateBizInfraItem = updateBizInfraItem;
const deleteBizInfraItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const deletedItem = await bizInfraModel_1.BizInfra.findOneAndDelete({ _id: id, userId });
        if (!deletedItem) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting BizInfra item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};
exports.deleteBizInfraItem = deleteBizInfraItem;
//# sourceMappingURL=bizInfraController.js.map