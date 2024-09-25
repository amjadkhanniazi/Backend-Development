import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './route/auth.js';


const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));

connectDB();

app.use('/auth', userRoutes);


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});