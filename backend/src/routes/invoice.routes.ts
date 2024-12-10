import { Router } from 'express';
import { 
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoices,
  downloadInvoice
} from '../controllers/invoice.controller';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.use(auth);

router.post('/', asyncHandler(createInvoice));
router.get('/', asyncHandler(getInvoices));
router.get('/:id', asyncHandler(getInvoice));
router.put('/:id', asyncHandler(updateInvoice));
router.patch('/:id/status', asyncHandler(updateInvoiceStatus));
router.delete('/', asyncHandler(deleteInvoices));
router.get('/:id/download', asyncHandler(downloadInvoice));

export default router;