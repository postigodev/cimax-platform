import { Router } from 'express';
import { createDoctor, deleteDoctor, editDoctor, getDoctors, getTomas } from '../controllers/doctor';
import { asyncHandler } from '../middlewares/error.middlewares';

const router = Router();

router.post('/create-doctor', asyncHandler(createDoctor));
router.put('/edit-doctor/:id', asyncHandler(editDoctor));
router.get('/all', asyncHandler(getDoctors));
router.get('/tomas', asyncHandler(getTomas));
router.delete('/delete-doctor/:id', asyncHandler(deleteDoctor));

module.exports = router;
