import express, { Router } from 'express';
import authController from '../controllers/authController';
import borrowBookFormController from '../controllers/borrowBookFormController.ts';
import returnBookFormRouter from './returnBookFormRoutes';

const router: Router = express.Router();
router.use('/:borrowBookFormId/return-book-forms', returnBookFormRouter);

router.use(authController.protect);
router
  .route('/')
  .get(borrowBookFormController.getAllBorrowBookForm)
  .post(borrowBookFormController.setBorrowerId, borrowBookFormController.createBorrowBookForm);

router
  .route('/:id')
  .get(borrowBookFormController.getBorrowBookForm)
  .patch(borrowBookFormController.updateBorrowBookForm)
  .delete(borrowBookFormController.deleteBorrowBookForm);

export default router;
