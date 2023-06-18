import express, { Router } from 'express';
import authController from '../controllers/authController';
import returnBookFormController from '../controllers/returnBookFormController';

const router: Router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/')
  .get(returnBookFormController.getAllReturnBookForm)
  .post(
    returnBookFormController.setBorrowerBookReturnFormId,
    returnBookFormController.createReturnBookForm
  );

router.use(authController.restrictTo('admin'));
router
  .route('/:id')
  .get(returnBookFormController.getReturnBookForm)
  .patch(returnBookFormController.updateReturnBookForm)
  .delete(returnBookFormController.deleteReturnBookForm);

export default router;
