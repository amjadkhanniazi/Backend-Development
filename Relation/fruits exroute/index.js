import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import 'dotenv/config';
import fruitsRoutes from './routes/fruitAPI.js';
import authRoutes from './routes/authAPI.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectDB();

// Use routers
app.get("/", (req, res) => res.send("Express on Vercel"));
app.use('/fruits', fruitsRoutes);
app.use('/auth', authRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});