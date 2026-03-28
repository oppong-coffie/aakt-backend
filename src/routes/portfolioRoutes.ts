import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createPortfolioItem,
    getPortfolioItems,
    updatePortfolioItem,
    deletePortfolioItem,
    reorderPortfolioItems,
} from '../controllers/portfolioController';

const router = express.Router();

router.use(authenticateToken as any);

// Reorder must come before /:id so it doesn't match as an ID
router.patch('/reorder', reorderPortfolioItems as any);

router.post('/:category', createPortfolioItem as any);
router.get('/:category/:itemType', getPortfolioItems as any); // e.g. /saas/department
router.put('/:id', updatePortfolioItem as any);
router.delete('/:id', deletePortfolioItem as any);

export default router;
