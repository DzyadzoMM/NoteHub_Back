import { Router } from 'express';
import { celebrate} from 'celebrate';
import { updateUserAvatar, getCurrentUser, updateUser } from '../controllers/userController.js';
import { upload } from '../middleware/multer.js';
import { authenticate } from '../middleware/authenticate.js';
import { updateUserSchema } from '../validations/userValidation.js';

const router = Router();

router.get('/users/me', authenticate, getCurrentUser);

router.patch('/users/me/avatar', authenticate, upload.single("avatar") ,updateUserAvatar);
router.patch('/users/me', authenticate, celebrate(updateUserSchema), updateUser);

export default router;
