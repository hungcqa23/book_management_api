import { Router } from 'express';
import authController from '../controllers/authController';
import feeReceiptController from '../controllers/feeReceiptController';
const router = Router();

router.use(authController.protect);
router
  .route('/')
  .get(feeReceiptController.getAllFeeReceipt)
  .post(feeReceiptController.createFeeReceipt);

router
  .route('/:id')
  .get(feeReceiptController.getFeeReceipt)
  .patch(feeReceiptController.updateFeeReceipt)
  .delete(feeReceiptController.deleteFeeReceipt);

export default router;
