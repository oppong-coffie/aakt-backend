import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createSpreadsheet,
    getSpreadsheets,
    updateSpreadsheet,
    deleteSpreadsheet,
} from '../controllers/userSpreadsheetController';

const router = express.Router();

// Require authorization token for all spreadsheet endpoints
router.use(authenticateToken as any);

router.post('/', createSpreadsheet as any);
router.get('/', getSpreadsheets as any);
router.put('/:id', updateSpreadsheet as any);
router.delete('/:id', deleteSpreadsheet as any);

export default router;
