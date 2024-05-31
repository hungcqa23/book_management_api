import express, { Router } from 'express';
import authController from '../controllers/auth.controllers';
import borrowBookFormController from '../controllers/borrow-book-form.controllers.ts';
import returnBookFormRouter from './return-book-form.routes';

const router: Router = express.Router();

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

router.use('/:borrowBookFormId/return-book-forms', returnBookFormRouter);
export default router;
