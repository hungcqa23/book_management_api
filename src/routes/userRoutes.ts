import express, { Router } from 'express';
import authController from './../controllers/authController';
import userController from '../controllers/userController';
const router: Router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.post('/refresh', authController.refreshToken);

router.get('/:id/avatar', userController.getUser);
router.use(authController.protect);
router.get('/me', userController.getMe, authController.getMe);
router.patch('/updateMe', userController.uploadAvatar, userController.updateMe);

router.get('', userController.getAllUsers);
router.get('/:id', userController.getUser);

export default router;
