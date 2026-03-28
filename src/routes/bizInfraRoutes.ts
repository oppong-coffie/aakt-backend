import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createBizInfraItem,
    getBizInfraItems,
    updateBizInfraItem,
    deleteBizInfraItem,
} from '../controllers/bizInfraController';

const router = express.Router();

router.use(authenticateToken as any);

router.post('/:category', createBizInfraItem as any);
router.get('/:category', getBizInfraItems as any);
router.put('/:id', updateBizInfraItem as any);
router.delete('/:id', deleteBizInfraItem as any);

export default router;
