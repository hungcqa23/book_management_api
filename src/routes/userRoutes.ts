import express, { Router } from 'express';
import authController from './../controllers/authController';
import userController from '../controllers/userController';
const router: Router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);

router.use(authController.protect);
router.get('/:id', userController.getMe, userController.getUser);
router.get('/:id/profile', authController.getMe, userController.getUser);

export default router;
