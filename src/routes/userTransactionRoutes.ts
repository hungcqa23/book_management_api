import express, { Router } from 'express';
import userTransactionController from '../controllers/userTransactionController';

const router: Router = express.Router();

router.route('/').get(userTransactionController.updateStatusTransaction);

export default router;
