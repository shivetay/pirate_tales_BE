import express from 'express';
import { authController, userController } from '../controllers';

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/signin').post(authController.signIn);

router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUserById);

export default router;
