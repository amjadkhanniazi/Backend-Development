import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import rooms from './models/rooms.js';
import authenticateToken from './midllewares/auth.js';
import user from './models/user.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/rooms', authenticateToken,  async (req,res)=>{
    const room = await rooms.find();
    res.json(room);
})

app.post('/rooms/new',authenticateToken, async (req,res)=>{
    await rooms.create(req.body);
    res.json({message: "Room created"});
})

app.get('/rooms/:id',authenticateToken, async (req,res)=>{
    const room = await rooms.findById(req.params.id);
    res.json(room)
})

app.delete('/rooms/:id',authenticateToken, async (req,res)=>{
    await rooms.findByIdAndDelete(req.params.id);
    res.json({message: "Room deleted"});
})


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new user({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = await user.findOne({ username });
        if (!newUser) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await newUser.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = newUser.getToken();
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/logout', (req, res) => {
    // Since JWTs are stateless, there's nothing to do on the server side.
    // Inform the client to delete the token.
    res.json({ message: 'Logged out successfully' });
});
app.listen(5001)