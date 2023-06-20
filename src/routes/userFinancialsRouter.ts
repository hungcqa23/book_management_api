import { Router } from 'express';
import authController from '../controllers/authController';
import userFinancialsController from '../controllers/userFinancialsController';
import userController from '../controllers/userController';

const router = Router();
router.use(authController.protect);
router.route('/').get(userFinancialsController.getAllUserFinancials);

export default router;
