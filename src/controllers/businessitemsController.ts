import { Request, Response } from 'express';
import { BusinessTask } from '../models/businessModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const submitBusinessTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { businessId, taskName, documents } = req.body;

        // Optionally, check for authentication
        // const userId = (req as AuthenticatedRequest).user?.id;
        // if (!userId) {
        //     res.status(401).json({ error: 'Unauthorized: token required' });
        //     return;
        // }

        if (!businessId) {
            res.status(400).json({ error: 'businessId is required.' });
            return;
        }

        if (!taskName) {
            res.status(400).json({ error: 'taskName is required.' });
            return;
        }

        const newTask = new BusinessTask({
            businessId,
            taskName,
            documents: documents || []
        });

        const savedTask = await newTask.save();
        res.status(201).json({ message: 'Business task submitted successfully', data: savedTask });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getBusinessTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const { businessId } = req.params;

        if (!businessId) {
            res.status(400).json({ error: 'businessId is required.' });
            return;
        }

        const tasks = await BusinessTask.find({ businessId });
        res.status(200).json({ data: tasks });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const addDocumentToTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { taskId } = req.params;
        const { name, url } = req.body;

        if (!taskId) {
            res.status(400).json({ error: 'taskId is required.' });
            return;
        }

        if (!name || !url) {
            res.status(400).json({ error: 'document name and url are required.' });
            return;
        }

        const updatedTask = await BusinessTask.findByIdAndUpdate(
            taskId,
            { $push: { documents: { name, url } } },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            res.status(404).json({ error: 'Business task not found.' });
            return;
        }

        res.status(200).json({ message: 'Document added successfully', data: updatedTask });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
