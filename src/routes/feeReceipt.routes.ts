import { NextFunction, Request, Response, Router } from 'express';
import authController from '../controllers/auth.controllers';
import feeReceiptController from '../controllers/feeReceipt.controllers';
import UserFinancials from '../models/schemas/userFinancials';
import { AuthRequest, IUserFinancials } from '../models/interfaces/model.interfaces';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
const router = Router();

const setUserFinancials = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userFinancials: IUserFinancials | null = await UserFinancials.findOne({
    user: req.user.id
  });
  if (!userFinancials) {
    return next(new AppError(`Please login with account!`));
  }
  req.body.userFinancials = userFinancials.id;
  next();
});

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
