import { Router } from 'express';
import { 
  createQuote,
  getQuotes,
  getQuote,
  updateQuote,
  updateQuoteStatus,
  deleteQuotes,
  downloadQuote
} from '../controllers/quote.controller';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.use(auth);

router.post('/', asyncHandler(createQuote));
router.get('/', asyncHandler(getQuotes));
router.get('/:id', asyncHandler(getQuote));
router.put('/:id', asyncHandler(updateQuote));
router.patch('/:id/status', asyncHandler(updateQuoteStatus));
router.delete('/', asyncHandler(deleteQuotes));
router.get('/:id/download', asyncHandler(downloadQuote));

export default router;