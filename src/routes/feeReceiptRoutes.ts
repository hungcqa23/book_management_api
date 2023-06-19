import { NextFunction, Request, Response, Router } from 'express';
import authController from '../controllers/authController';
import feeReceiptController from '../controllers/feeReceiptController';
import UserFinancials from '../models/userFinancials';
import { AuthRequest, IUserFinancials } from '../interfaces/model.interfaces';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
const router = Router();

const setUserFinancials = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userFinancials: IUserFinancials | null = await UserFinancials.findById(req.user.id);
    if (!userFinancials) {
      return next(new AppError(`Please login with account!`));
    }
    req.body.userFinancials = userFinancials.id;
    next();
  }
);

router.use(authController.protect);
router
  .route('/')
  .get(feeReceiptController.getAllFeeReceipt)
  .post(setUserFinancials, feeReceiptController.createFeeReceipt);

router
  .route('/:id')
  .get(feeReceiptController.getFeeReceipt)
  .patch(feeReceiptController.updateFeeReceipt)
  .delete(feeReceiptController.deleteFeeReceipt);

export default router;
