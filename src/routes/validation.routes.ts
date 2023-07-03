import { Router } from 'express';
import { getCurrentValidation, setLibraryValidation } from '../controllers/validation.controllers';
const router = Router();

router.route('/').get(getCurrentValidation).post(setLibraryValidation);
export default router;
