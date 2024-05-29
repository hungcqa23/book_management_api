import express, { Router } from 'express';
import BookController from '../controllers/book.controllers';
import reviewRouter from './review.routes';
import authController from '../controllers/auth.controllers';

const router: Router = express.Router();
router.use('/:bookId/reviews', reviewRouter);

router.get('/:id/images/:index', BookController.getBookImage);

router
  .route('')
  .get(BookController.getAllBook)
  .post(authController.protect, authController.restrictTo('admin'), BookController.createBook);

router
  .route('/:id')
  .get(BookController.getBook)
  .patch(BookController.uploadBookImages, BookController.addImages, BookController.updateBook)
  .delete(authController.protect, authController.restrictTo('admin'), BookController.deleteBook);

export default router;
