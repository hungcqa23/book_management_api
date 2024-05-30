import express, { Router } from 'express';
import userTransactionController from '../controllers/user-transaction.controllers';
import authController from '../controllers/auth.controllers';

const router: Router = express.Router();

router.use(authController.protect);
router.route('/').post(userTransactionController.updateStatusTransaction);

export default router;
