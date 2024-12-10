import { Router } from 'express';
import { getStatistics, exportData } from '../controllers/statistics.controller';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.use(auth);

router.get('/', asyncHandler(getStatistics));
router.get('/export', asyncHandler(exportData));

export default router;