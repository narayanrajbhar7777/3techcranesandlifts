import express from 'express';
import multer from 'multer';
import path from 'path';
import { getMyProfile, updateMyProfile, changePassword, uploadProfilePicture } from '../controllers/userController';

const router = express.Router();

// Multer config for profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);
router.post('/change-password', changePassword);
router.post('/upload-picture', upload.single('file'), uploadProfilePicture);

export default router;
