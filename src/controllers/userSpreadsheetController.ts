import { Response } from 'express';
import { UserSpreadsheet } from '../models/userSpreadsheetModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createSpreadsheet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { title, workbookData } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!title) {
            res.status(400).json({ error: 'Title is required' });
            return;
        }

        const newSpreadsheet = new UserSpreadsheet({
            userId,
            title,
            workbookData: workbookData || {
                id: `workbook-${Date.now()}`,
                locale: 'enUS',
                name: title,
                sheets: {
                    'sheet-1': {
                        id: 'sheet-1',
                        name: 'Sheet1',
                        rowCount: 100,
                        columnCount: 20,
                        cellData: {}
                    }
                }
            }
        });

        const savedSpreadsheet = await newSpreadsheet.save();
        res.status(201).json(savedSpreadsheet);
    } catch (error) {
        console.error('Error creating Spreadsheet:', error);
        res.status(500).json({ error: 'Failed to create spreadsheet' });
    }
};

export const getSpreadsheets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const spreadsheets = await UserSpreadsheet.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json(spreadsheets);
    } catch (error) {
        console.error('Error fetching Spreadsheets:', error);
        res.status(500).json({ error: 'Failed to fetch spreadsheets' });
    }
};

export const updateSpreadsheet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, workbookData } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const updateFields: any = {};
        if (title !== undefined) updateFields.title = title;
        if (workbookData !== undefined) updateFields.workbookData = workbookData;

        const updatedSpreadsheet = await UserSpreadsheet.findOneAndUpdate(
            { _id: id, userId },
            updateFields,
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedSpreadsheet) {
            res.status(404).json({ error: 'Spreadsheet not found' });
            return;
        }

        res.status(200).json(updatedSpreadsheet);
    } catch (error) {
        console.error('Error updating Spreadsheet:', error);
        res.status(500).json({ error: 'Failed to update spreadsheet' });
    }
};

export const deleteSpreadsheet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const deletedSpreadsheet = await UserSpreadsheet.findOneAndDelete({ _id: id, userId });

        if (!deletedSpreadsheet) {
            res.status(404).json({ error: 'Spreadsheet not found' });
            return;
        }

        res.status(200).json({ message: 'Spreadsheet deleted successfully' });
    } catch (error) {
        console.error('Error deleting Spreadsheet:', error);
        res.status(500).json({ error: 'Failed to delete spreadsheet' });
    }
};
