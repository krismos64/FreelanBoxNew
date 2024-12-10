import { Router } from 'express';
import { 
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} from '../controllers/event.controller';
import { auth } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.use(auth);

router.post('/', asyncHandler(createEvent));
router.get('/', asyncHandler(getEvents));
router.put('/:id', asyncHandler(updateEvent));
router.delete('/:id', asyncHandler(deleteEvent));

export default router;