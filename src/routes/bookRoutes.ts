import express, { Router } from 'express';
import BookController from '../controllers/bookController';

const { getAllBook, getBook, createBook, updateBook, deleteBook } = BookController;

const router: Router = express.Router();

router.route('').get(getAllBook).post(createBook);
router.route('/:id').get(getBook).patch(updateBook).delete(deleteBook);

export default router;
