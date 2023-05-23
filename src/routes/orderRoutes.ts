import express, { Router } from 'express';

import authController from '../controllers/authController';
import orderController from '../controllers/orderController';

const router: Router = express.Router();
router.use(authController.protect);
router.get('/checkout', orderController.createOrderCheckout);
router.post('/checkout-session/', orderController.getCheckOutSession);
export default router;
