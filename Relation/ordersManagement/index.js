import express from 'express';
import connectDB from './config/db.js';
import cors  from 'cors';
import 'dotenv/config';
import userRoutes from './routes/auth.js';
import postRoutes from './routes/postRoutes.js';
import apiLimiter from './middlewares/apiLimiter.js';

const app=express();


const corsOptions = {
    origin: ['https://yourdomain.com', 'http://localhst:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600 // 10 minutes, 600 Seconds
};


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));

connectDB();

app.use('/user', userRoutes);
app.use('/post', apiLimiter,postRoutes);

app.listen(5000,  () => {
    console.log('server is running on http://localhost:5000');
})




