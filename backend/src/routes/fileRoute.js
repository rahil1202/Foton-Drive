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

router.get('/', verifyToken ,getFilesAndFolders);

router.post('/upload-file', verifyToken, upload.single('file'), uploadFile);

router.post('/create-folder', verifyToken, createFolder);

router.get('/search', verifyToken, searchFilesAndFolders);

router.get('/recent', verifyToken, getRecentItems);

router.post('/share/email', verifyToken, shareByEmail);

router.post('/share/link', verifyToken, generateShareLink);

router.delete('/:id', verifyToken, deleteItem);

router.get('/share/:id/:token', accessSharedItem);

export default router;
