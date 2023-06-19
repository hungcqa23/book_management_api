import { Router } from 'express';
import authController from '../controllers/authController';
import userFinancialsController from '../controllers/userFinancialsController';

const router = Router();
router.use(authController.protect);
router.route('/').get(userFinancialsController.getAllUserFinancials);

export default router;
