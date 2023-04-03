import express, { Router } from 'express';
import authController from './../controllers/authController';

const router: Router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login');

export default router;
