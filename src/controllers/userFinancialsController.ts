import UserFinancials from '../models/userFinancials';
import handleFactory from './handleFactory';

const getAllUserFinancials = handleFactory.getAll(UserFinancials);

export default {
  getAllUserFinancials
};
