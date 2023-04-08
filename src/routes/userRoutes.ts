import express, { Router } from 'express';
import authController from './../controllers/authController';

const router: Router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.get('/:id', authController.getUser);

router.use(authController.protect);
router.get('/:id/profile', authController.getMe);

export default router;
