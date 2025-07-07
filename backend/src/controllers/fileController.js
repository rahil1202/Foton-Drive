import File from '../models/fileSchema.js';
import User from '../models/userSchema.js';
import cloudinary from '../config/cloudinary.js';
import { getFileType } from '../utils/fileUtils.js';
import crypto from 'crypto';

// Upload a single file
export const uploadFile = async (req, res) => {
  const userId = req.user._id;
  const { parentFolder } = req.body;
  const file = req.file;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: `user_${userId}` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    // Determine file type
    const fileType = getFileType(file.mimetype);

    // Check for duplicate file name
    const existingFile = await File.findOne({
      userId,
      name: file.originalname,
      type: 'file',
      parentFolder: parentFolder || null,
    });
    if (existingFile) {
      return res.status(400).json({ message: 'File with this name already exists in the folder' });
    }

    // Save file metadata
    const newFile = new File({
      userId,
      name: file.originalname,
      type: 'file',
      fileType,
      mimeType: file.mimetype,
      parentFolder: parentFolder || null,
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      size: file.size,
    });

    await newFile.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        _id: newFile._id,
        name: newFile.name,
        type: newFile.type,
        fileType: newFile.fileType,
        mimeType: newFile.mimeType,
        url: newFile.cloudinaryUrl,
        size: newFile.size,
        parentFolder: newFile.parentFolder,
        createdAt: newFile.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

// Create a folder
export const createFolder = async (req, res) => {
  const userId = req.user._id;
  const { name, parentFolder } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  if (!name) {
    return res.status(400).json({ message: 'Folder name is required' });
  }

  try {
    // Check for duplicate folder name
    const existingFolder = await File.findOne({
      userId,
      name,
      type: 'folder',
      parentFolder: parentFolder || null,
    });
    if (existingFolder) {
      return res.status(400).json({ message: 'Folder with this name already exists' });
    }

    const newFolder = new File({
      userId,
      name,
      type: 'folder',
      parentFolder: parentFolder || null,
    });

    await newFolder.save();

    res.status(201).json({
      message: 'Folder created successfully',
      folder: {
        _id: newFolder._id,
        name: newFolder.name,
        type: newFolder.type,
        parentFolder: newFolder.parentFolder,
        createdAt: newFolder.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating folder', error: error.message });
  }
};

export const getFilesAndFolders = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Retrieve files and folders for the user with the pagination
  // and sorting by creation date in descending order

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const total = await File.countDocuments({ userId });

  try {
    const items = await File.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);

    if (!items || items.length === 0) {
      return res.status(404).json({ message: 'No files or folders found' });
    }

    items.forEach((item) => {
      item.cloudinaryPublicId = undefined;
    });

    res.status(200).json({
      message: 'Files and folders retrieved successfully',
      items,
      total,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving files and folders', error: error.message });
  }
};

// Share file/folder by email
export const shareByEmail = async (req, res) => {
  const userId = req.user._id;
  const { id, email } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  if (!id || !email) {
    return res.status(400).json({ message: 'Item ID and email are required' });
  }

  try {
    const item = await File.findOne({ _id: id, userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    if (targetUser._id.toString() === userId.toString()) {
      return res.status(400).json({ message: 'Cannot share with yourself' });
    }

    if (!item.sharedWith.some((share) => share.userId.toString() === targetUser._id.toString())) {
      item.sharedWith.push({ userId: targetUser._id, email });
      await item.save();
    }

    res.status(200).json({ message: 'Item shared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing item', error: error.message });
  }
};

// Generate shareable link
export const generateShareLink = async (req, res) => {
  const userId = req.user._id;
  const { id, expiresInDays } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  if (!id) {
    return res.status(400).json({ message: 'Item ID is required' });
  }

  try {
    const item = await File.findOne({ _id: id, userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    item.shareLink = { token, expires };
    await item.save();

    const shareUrl = `${process.env.FRONTEND_URL}/share/${item._id}/${token}`;
    res.status(200).json({ message: 'Share link generated', shareUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error generating share link', error: error.message });
  }
};

// Access shared item
export const accessSharedItem = async (req, res) => {
  const { id, token } = req.params;

  if (!id || !token) {
    return res.status(400).json({ message: 'Item ID and token are required' });
  }

  try {
    const item = await File.findById(id).select('-cloudinaryPublicId');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!item.shareLink || item.shareLink.token !== token) {
      return res.status(403).json({ message: 'Invalid or expired share link' });
    }

    if (item.shareLink.expires && item.shareLink.expires < Date.now()) {
      return res.status(403).json({ message: 'Share link has expired' });
    }

    let contents = [];
    if (item.type === 'folder') {
      contents = await File.find({ parentFolder: id }).select('-cloudinaryPublicId');
    }

    res.status(200).json({
      message: 'Item accessed successfully',
      item: {
        _id: item._id,
        name: item.name,
        type: item.type,
        fileType: item.fileType,
        mimeType: item.mimeType,
        url: item.cloudinaryUrl,
        size: item.size,
        parentFolder: item.parentFolder,
        createdAt: item.createdAt,
        contents: item.type === 'folder' ? contents : undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error accessing shared item', error: error.message });
  }
};

// Search files and folders
export const searchFilesAndFolders = async (req, res) => {
  const userId = req.user._id;
  const { query, fileType, parentFolder } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const searchCriteria = { userId };
    if (query) {
      searchCriteria.name = { $regex: query, $options: 'i' };
    }
    if (fileType) {
      searchCriteria.fileType = fileType;
    }
    if (parentFolder) {
      searchCriteria.parentFolder = parentFolder;
    }

    const items = await File.find(searchCriteria).select('-cloudinaryPublicId');

    const sharedItems = await File.find({
      'sharedWith.userId': userId,
    }).select('-cloudinaryPublicId');

    res.status(200).json({
      message: 'Search results retrieved successfully',
      items: [...items, ...sharedItems],
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching files and folders', error: error.message });
  }
};

// Get recent files and folders
export const getRecentItems = async (req, res) => {
  const userId = req.user._id;
  const limit = parseInt(req.query.limit) || 10;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const items = await File.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-cloudinaryPublicId');

    const sharedItems = await File.find({
      ' sharedWith.userId': userId,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-cloudinaryPublicId');

    const combinedItems = [...items, ...sharedItems]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);

    res.status(200).json({
      message: 'Recent items retrieved successfully',
      items: combinedItems,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recent items', error: error.message });
  }
};

// Delete a file or folder
export const deleteItem = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  if (!id) {
    return res.status(400).json({ message: 'Item ID is required' });
  }

  try {
    const item = await File.findOne({ _id: id, userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.type === 'file') {
      await cloudinary.uploader.destroy(item.cloudinaryPublicId);
    }

    if (item.type === 'folder') {
      const children = await File.find({ parentFolder: id });
      if (children.length > 0) {
        return res.status(400).json({ message: 'Cannot delete folder with contents' });
      }
    }

    await File.deleteOne({ _id: id });

    res
      .status(200)
      .json({ message: `${item.type === 'file' ? 'File' : 'Folder'} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};
