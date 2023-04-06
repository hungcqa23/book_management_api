import express, { Router } from 'express';
import authController from './../controllers/authController';

const router: Router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.get('/:id', authController.getUser);
router.get('/:id/profile', authController.protect, authController.getMe);

export default router;
