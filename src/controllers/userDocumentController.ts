import { Response } from 'express';
import { UserDocument } from '../models/userDocumentModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { title, content } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!title) {
            res.status(400).json({ error: 'Title is required' });
            return;
        }

        const newDoc = new UserDocument({
            userId,
            title,
            content: content || ''
        });

        const savedDoc = await newDoc.save();
        res.status(201).json(savedDoc);
    } catch (error) {
        console.error('Error creating UserDocument:', error);
        res.status(500).json({ error: 'Failed to create document' });
    }
};

export const getDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const documents = await UserDocument.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json(documents);
    } catch (error) {
        console.error('Error fetching UserDocuments:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};

export const updateDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updatedDoc = await UserDocument.findOneAndUpdate(
            { _id: id, userId },
            { title, content },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedDoc) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        res.status(200).json(updatedDoc);
    } catch (error) {
        console.error('Error updating UserDocument:', error);
        res.status(500).json({ error: 'Failed to update document' });
    }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const deletedDoc = await UserDocument.findOneAndDelete({ _id: id, userId });

        if (!deletedDoc) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting UserDocument:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
};
