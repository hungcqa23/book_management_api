import express, { Router } from 'express';
import authController from '../controllers/auth.controllers';
import borrowBookFormController from '../controllers/borrowBookForm.controllers.ts';
import returnBookFormRouter from './returnBookForm.routes';

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
