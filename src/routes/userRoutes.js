import { Router } from 'express';
import { celebrate } from 'celebrate';
import {updateUserAvatar, getCurrentUser} from '../controllers/userController.js';
import { upload } from '../middleware/multer.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/users/me', authenticate, getCurrentUser);

router.patch('/users/me/avatar', authenticate, upload.single("avatar") ,updateUserAvatar);

export default router;
