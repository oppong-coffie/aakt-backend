import { Request, Response } from 'express';
import { BusinessDocument } from '../models/businessDocumentModel';

export const submitBusinessDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const { businessId, name, url } = req.body;

        if (!businessId || !name || !url) {
            res.status(400).json({ error: 'businessId, name, and url are required.' });
            return;
        }

        const newDoc = new BusinessDocument({
            businessId,
            name,
            url
        });

        const savedDoc = await newDoc.save();
        res.status(201).json({ message: 'Business document submitted successfully', data: savedDoc });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getBusinessDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { businessId } = req.params;

        if (!businessId) {
            res.status(400).json({ error: 'businessId is required.' });
            return;
        }

        const documents = await BusinessDocument.find({ businessId });
        res.status(200).json({ data: documents });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getBusinessDocumentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            res.status(400).json({ error: 'documentId is required.' });
            return;
        }

        const document = await BusinessDocument.findById(documentId);
        if (!document) {
            res.status(404).json({ error: 'Business document not found.' });
            return;
        }

        res.status(200).json({ data: document });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateBusinessDocumentFolder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { documentId } = req.params;
        const { folderId } = req.body;

        if (!documentId || !folderId) {
            res.status(400).json({ error: 'documentId and folderId are required.' });
            return;
        }

        const updatedDoc = await BusinessDocument.findByIdAndUpdate(
            documentId,
            { $set: { folderId } },
            { new: true, runValidators: true }
        );

        if (!updatedDoc) {
            res.status(404).json({ error: 'Business document not found.' });
            return;
        }

        res.status(200).json({ message: 'Document folder updated successfully', data: updatedDoc });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
