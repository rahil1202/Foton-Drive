import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteMyAccount,
} from '../controllers/userController.js';
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.use(verifyToken);

router.get('/profile', getMyProfile);

router.put('/profile', updateMyProfile);

router.put('/change-password', changePassword);

router.delete('/delete-account', deleteMyAccount);

export default router;
