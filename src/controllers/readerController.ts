import Reader from '../models/readerModel';
import handleFactory from './handleFactory';

const getAllReader = handleFactory.getAll(Reader);
const getReader = handleFactory.getOne(Reader);
const updateReader = handleFactory.updateOne(Reader);
const createReader = handleFactory.createOne(Reader);
const deleteReader = handleFactory.deleteOne(Reader);

export default {
  getAllReader,
  getReader,
  updateReader,
  createReader,
  deleteReader
};
