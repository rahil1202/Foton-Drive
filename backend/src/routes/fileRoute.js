import express from 'express';
import {
  uploadFile,
  createFolder,
  getFilesAndFolders,
  deleteItem,
  shareByEmail,
  generateShareLink,
  accessSharedItem,
  searchFilesAndFolders,
  getRecentItems,
} from '../controllers/fileController.js';
import upload from '../config/multer.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getFilesAndFolders);

router.post('/upload-file', upload.single('file'), uploadFile);

router.post('/create-folder', createFolder);


router.get('/search', searchFilesAndFolders);

router.get('/recent', getRecentItems);

router.post('/share/email', shareByEmail);

router.post('/share/link', generateShareLink);

router.delete('/:id', deleteItem);

router.get('/share/:id/:token', accessSharedItem);

export default router;
