import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createSlideDeck,
    getSlideDecks,
    updateSlideDeck,
    deleteSlideDeck,
} from '../controllers/userSlideController';

const router = express.Router();

// Require authorization token for all slide endpoints
router.use(authenticateToken as any);

router.post('/', createSlideDeck as any);
router.get('/', getSlideDecks as any);
router.put('/:id', updateSlideDeck as any);
router.delete('/:id', deleteSlideDeck as any);

export default router;
