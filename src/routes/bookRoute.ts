import express, { Router } from 'express';
import BookController from './../controllers/bookController';
import route from './userRoute';

const { getAllBook, getBook, createBook, updateBook, deleteBook } = BookController;

const router: Router = express.Router();
router.route('').get(getAllBook).put(updateBook);
router.route('/:id').get(getBook).patch(updateBook).delete(deleteBook);

export default router;
