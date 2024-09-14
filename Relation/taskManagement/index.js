import express from 'express';
import connectDB from './config/db.js';
import cors  from 'cors';
import 'dotenv/config';
import  userRoutes from './routes/auth.js';
import   taskRoutes from './routes/taskRoutes.js';

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

connectDB();

app.use('/user', userRoutes);
app.use('/tasks',taskRoutes);

app.listen(5000,  () => {
    console.log('server is running on http://localhost:5000');
})
