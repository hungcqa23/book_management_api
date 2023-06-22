import express, { Router } from 'express';
import userTransactionController from '../controllers/userTransactionController';
import authController from '../controllers/authController';

const router: Router = express.Router();

router.use(authController.protect);
router.route('/').post(userTransactionController.updateStatusTransaction);

export default router;
