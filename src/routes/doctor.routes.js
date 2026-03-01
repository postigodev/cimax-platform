import { Router } from 'express';
import { createDoctor, deleteDoctor, editDoctor, getDoctors, getTomas } from '../controllers/doctor';

const router = Router();

router.post('/create-doctor', createDoctor);
router.put('/edit-doctor/:id', editDoctor);
router.get('/all', getDoctors);
router.get('/tomas', getTomas);
router.delete('/delete-doctor/:id', deleteDoctor);

module.exports = router;