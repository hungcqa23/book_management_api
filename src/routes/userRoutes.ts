import express, { Router } from 'express';
import authController from './../controllers/authController';
import userController from '../controllers/userController';
const router: Router = express.Router();

router.get('/:id/avatar', userController.getAvatar);
router.post('/signUp', authController.signUp);
router.post('/logIn', authController.logIn);
router.post('/refresh', authController.refreshToken);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.get('/me', userController.getMe, userController.getUser);
router.delete('/deleteMe', userController.getMe, userController.deleteMe);
router.patch('/updateMe', userController.uploadAvatar, userController.updateMe);
router.post('/logout', authController.logOut);
router.post('/deactivate', userController.deactivate);

router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.getUser).delete(userController.deleteUser);

export default router;
