import express, { Router } from 'express';
import readerController from '../controllers/reader.controllers';
import authController from '../controllers/auth.controllers';

const router: Router = express.Router();

router.use(authController.protect);
router.route('/').get(readerController.getAllReader).post(readerController.createReader);

router
  .route('/:id')
  .get(readerController.getReader)
  .patch(authController.restrictTo('admin'), readerController.updateReader)
  .delete(authController.restrictTo('admin'), readerController.deleteReader);

export default router;
