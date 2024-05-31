import express, { Router } from 'express';
import authController from '../controllers/auth.controllers';
import userController from '../controllers/user.controllers';
const router: Router = express.Router();

// router.post('/login', (req, res) => {
//   res.status(200).json({
//     status: 'success'
//   });
// });
// router.get('/oauth/google', authController.OAuthGoogle);
router.post('/login', authController.logIn);
router.post('/signup', authController.signUp);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.get('/:id/avatar', userController.getAvatar);

router.use(authController.protect);
router.patch('/update-me', userController.uploadAvatar, userController.updateMe);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/update-me/:id', userController.uploadAvatar, userController.updateMe);
router.patch('/update-my-password', authController.updatePassword);
router.post('/logout', authController.logOut);
// router.post('/deactivate', userController.deactivate);
router.post('/top-up', userController.topUp);

router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.getUser).delete(userController.deleteUser);

export default router;
