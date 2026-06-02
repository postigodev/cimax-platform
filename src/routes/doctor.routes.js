import { Router } from 'express';
import { createDoctor, deleteDoctor, editDoctor, getDoctors, getTomas } from '../controllers/doctor';
import { requireRole } from '../middlewares/auth.middlewares';
import { asyncHandler } from '../middlewares/error.middlewares';

const router = Router();

router.post('/create-doctor', requireRole('admin'), asyncHandler(createDoctor));
router.put('/edit-doctor/:id', requireRole('admin'), asyncHandler(editDoctor));
router.get('/all', asyncHandler(getDoctors));
router.get('/tomas', asyncHandler(getTomas));
router.delete('/delete-doctor/:id', requireRole('admin'), asyncHandler(deleteDoctor));

module.exports = router;
