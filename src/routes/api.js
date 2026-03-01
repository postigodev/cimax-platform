import { Router } from 'express';

const router = Router();

router.use('/ordenes', require('./orden.routes'));
router.use('/doctores', require('./doctor.routes'));

module.exports = router; 