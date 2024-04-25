import { Router } from 'express';
import authController from '../controllers/auth.controllers';
import userFinancialsController from '../controllers/userFinancials.controllers';

const router = Router();
router.use(authController.protect);
router.route('/').get(userFinancialsController.getAllUserFinancials);
router.route('/me').get(userFinancialsController.getMe);

export default router;
