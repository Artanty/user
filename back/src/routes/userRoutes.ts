import express from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../utils/auth';

const router = express.Router();
const controller = new UserController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/profile', authenticate, controller.getProfile);

export default router;
