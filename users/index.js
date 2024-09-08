import express from 'express';
import cors from 'cors';
import ConnectDB from './config/db.js';
import users from './models/users.js';
import authenticateToken from './middlewares/auth.js';
import jwt from 'jsonwebtoken';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

ConnectDB();

//Get All Users
app.get('/users',authenticateToken, async (req, res) => {
    
    const result=await users.find();
    res.json({
        result
    })
})

//test auth list
app.get('/test/list/data',authenticateToken, async(req,res)=>{
    res.json({
        message:'List Data'
    })
})

//Register
app.post('/register', async (req, res) => {
    const { email, password, name, address, phone } = req.body;
    try {
        const user = new users({ email, password, name, address, phone });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



//Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await users.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: users._id, email: users.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//logout
app.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});




app.listen(5010, () => console.log('http://localhost:5010'));
