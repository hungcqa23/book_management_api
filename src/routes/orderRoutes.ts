import express, { Router } from 'express';

import authController from '../controllers/authController';
import orderController from '../controllers/orderController';

const router: Router = express.Router();
router.get('/checkout', orderController.createOrderCheckout);
router.post('/checkout-session/', authController.protect, orderController.getCheckOutSession);
export default router;
