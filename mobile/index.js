import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import mobile from './models/mobile.js';
import user from './models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authenticateToken from './middlewares/auth.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

connectDB();

app.get('/mobiles',authenticateToken, async (req,res)=>{
    const mobiles = await mobile.find();
    res.json(mobiles);
})

app.post('/mobiles/new',authenticateToken, async (req,res)=>{
    await mobile.create(req.body);
    res.json({
        message: "Mobile added successfully"
    })
})

app.get('/mobiles/:id',authenticateToken,async (req,res)=>{
    const mobiles = await mobile.findById(req.params.id);
    res.json(mobiles);
})

app.delete('/mobiles/:id',authenticateToken, async (req,res)=>{
    await mobile.findByIdAndDelete(req.params.id);
    res.json({
        message: "Mobile deleted successfully"
    })
})


//User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new user({ username, password});
        await newUser.save();
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = await user.findOne({username})

        if (!newUser) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await newUser.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//logout
app.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});




app.listen(5008);