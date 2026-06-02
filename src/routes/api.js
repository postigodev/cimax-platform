import { Router } from 'express';

const router = Router();

router.use('/ordenes', require('./orden.routes'));
router.use('/doctores', require('./doctor.routes'));
router.use('/audit', require('./audit.routes'));

module.exports = router; 
