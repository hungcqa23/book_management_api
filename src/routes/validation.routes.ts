import { Router } from 'express';
import { getCurrentValidation, setLibraryValidation } from '../controllers/validationController';
const router = Router();

router.route('/').get(getCurrentValidation).post(setLibraryValidation);
export default router;
