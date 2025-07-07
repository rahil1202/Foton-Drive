import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: true,
  },
  fileType: {
    type: String,
    enum: ['image', 'video', 'audio', 'document', 'other', null],
    default: null,
  },
  mimeType: {
    type: String,
    default: null,
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null,
  },
  cloudinaryUrl: {
    type: String,
    required: function () {
      return this.type === 'file';
    },
  },
  cloudinaryPublicId: {
    type: String,
    required: function () {
      return this.type === 'file';
    },
  },
  size: {
    type: Number,
    required: function () {
      return this.type === 'file';
    },
  },
  sharedWith: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      email: {
        type: String,
        trim: true,
      },
    },
  ],
  shareLink: {
    token: {
      type: String,
      default: null,
    },
    expires: {
      type: Date,
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('File', fileSchema);
