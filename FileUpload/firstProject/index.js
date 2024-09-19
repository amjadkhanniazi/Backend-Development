import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

const app = express();

app.use(cors());
// __dirname and __filename in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',  // Folder where files will be saved
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload to accept any file with any field name
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },  // 1MB file size limit
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

// Route to upload files from any field name
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (req.files.length === 0) {
        res.status(400).send('No file selected!');
      } else {
        res.send(req.files.map(file => `File uploaded: ${file.filename}`).join(', '));
      }
    }
  });
});


// API to get a list of all uploaded files
app.get('/files', (req, res) => {
    // Read the files from the uploads directory
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).send('Unable to retrieve files');
      }
      // If no files exist, send an appropriate message
      if (files.length === 0) {
        return res.send('No files uploaded yet');
      }
      
      // Send the list of files as a response
      res.send(files);
    });
  });


// API to serve a specific file by name
  app.get('/files/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(uploadDir, fileName);
  
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send('File not found');
      }
      // Send the file as a response
      res.sendFile(filePath);
    });
  });


// get urls of all files
  app.get('/gallery', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).send('Unable to retrieve files');
      }
      const imageUrls = files.filter(file => /\.(jpg|jpeg|png|pdf|gif)$/.test(file))
                             .map(file => `http://localhost:5000/files/${file}`);
                             
      res.json(imageUrls);
    });
  });
  

  //delete an image
    app.delete('/filedel/:filename', (req, res) => {
        const fileName = req.params.filename;
        const filePath = path.join(uploadDir, fileName);
    
        // Check if the file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        // Delete the file
        fs.unlink(filePath, (err) => {
            if (err) {
            return res.status(500).send('Unable to delete file');
            }
            res.send('File deleted successfully');
        });
        });
    });





app.listen(5000, () => console.log('Server started on port 5000'));
