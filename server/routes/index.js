import { Router } from 'express';
import userRoutes from './users.js';

const router = Router();

router.use('/users', userRoutes);

export default router;
