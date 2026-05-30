import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginValidation, registerValidation } from '../validators/authValidators';

const router = Router();

router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);

export default router;
