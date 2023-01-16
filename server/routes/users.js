import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/users.js';

const userRoutes = Router();

userRoutes.get('/', getAllUsers);
userRoutes.post('/', createUser);

export default userRoutes;