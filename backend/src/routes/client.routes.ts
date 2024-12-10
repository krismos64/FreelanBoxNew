import { Router } from 'express';
import multer from 'multer';
import { 
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClients
} from '../controllers/client.controller';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(auth);

router.post('/', upload.single('logo'), asyncHandler(createClient));
router.get('/', asyncHandler(getClients));
router.get('/:id', asyncHandler(getClient));
router.put('/:id', upload.single('logo'), asyncHandler(updateClient));
router.delete('/', asyncHandler(deleteClients));

export default router;