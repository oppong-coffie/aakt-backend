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
