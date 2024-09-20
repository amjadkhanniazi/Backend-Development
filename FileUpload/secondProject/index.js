import express from 'express';
import cors from 'cors';
import authAPI  from './routes/auth.js';
import fileAPI from './routes/fileAPI.js'
import 'dotenv/config'
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

connectDB();


const __filename = fileURLToPath(import.meta.url);  // Get the current file path
const __dirname = path.dirname(__filename);         // Get the directory name

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/auth', authAPI);
app.use('/file',  fileAPI);


app.listen(5000, () => {console.log('Server is Running on http://localhost:5000')});
