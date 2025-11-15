const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const { sendResponse } = require('../utils/helpers');

const router = express.Router();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|csv|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// File upload endpoint
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  console.log('📍 File upload endpoint hit');
  
  try {
    if (!req.file) {
      return sendResponse(res, 400, false, 'No file uploaded');
    }

    const fileInfo = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploaded_by: req.user.userId,
      uploaded_at: new Date().toISOString()
    };

    console.log(`✅ File uploaded: ${req.file.originalname}`);
    sendResponse(res, 200, true, 'File uploaded successfully', fileInfo);
  } catch (error) {
    console.error('❌ File upload error:', error);
    sendResponse(res, 500, false, 'Failed to upload file');
  }
});

// Get file endpoint
router.get('/files/:filename', (req, res) => {
  console.log('📍 Get file endpoint hit');
  
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return sendResponse(res, 404, false, 'File not found');
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('❌ Get file error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve file');
  }
});

module.exports = router;