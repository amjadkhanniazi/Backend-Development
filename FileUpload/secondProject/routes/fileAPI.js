import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import File from '../models/files.js';  // Assuming this is the File schema
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authenticateToken from '../middlewares/authentication.js';

const router = express.Router();

// __dirname and __filename in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// Folder where files will be saved
const uploadDir = path.join(__dirname, 'uploads');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads',  // Adjusted to save in the correct folder
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload to accept any file with any field name
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 },  // 1MB file size limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).any();  // Accept files from any field name

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images or PDFs only!');
  }
}

// Route to upload files and save metadata to MongoDB
router.post('/upload', authenticateToken, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send(err);
    }

    if (req.files.length === 0) {
      return res.status(400).send('No file selected!');
    }

    try {
      const fileDetails = await Promise.all(req.files.map(async (file) => {
        // Construct file URL (adjust based on your server's structure)
        const fileUrl = `http://localhost:5000/uploads/${file.filename}`;

        // Create a new File document
        const newFile = new File({
          url: fileUrl,
          name: file.filename,
          user_id: req.user._id  // Ensure `user_id` is sent in the request body
        });

        // Save the file document to MongoDB
        await newFile.save();

        return `File uploaded: ${file.filename}`;
      }));

      res.send(fileDetails.join(', '));
    } catch (saveErr) {
      res.status(500).send(`Error saving files: ${saveErr.message}`);
    }
  });
});

// Route to get all files for a specific user
router.get('/getAll/:user_id', async (req, res) => {
    try {
      // Get user_id from the route parameter
      const userId = req.params.user_id;
  
      // Find all files that match the user_id
      const userFiles = await File.find({ user_id: userId });
  
      // If no files are found
      if (userFiles.length === 0) {
        return res.status(404).send('No files found for this user.');
      }
  
      // Return the files
      res.status(200).json(userFiles.map(file => file.url));
    } catch (err) {
      // Handle any errors during the query
      res.status(500).send(`Error retrieving files: ${err.message}`);
    }
  });





export default router;
