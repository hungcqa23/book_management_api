import express, { Router } from 'express';

import authController from '../controllers/auth.controllers';
import orderController from '../controllers/order.controllers';

const router: Router = express.Router();
router.use(authController.protect);
router.get('/checkout', orderController.createOrderCheckout);
router.post('/checkout-session/', orderController.getCheckOutSession);
export default router;
