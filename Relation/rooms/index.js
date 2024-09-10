import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import rooms from './models/rooms.js';
import user from './models/users.js';
import dotenv from 'dotenv';
import authenticateToken from './middlewares/auth.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

connectDB();

app.get('/rooms',async (req,res)=>{
    const allRooms= await rooms.find();
    res.json(allRooms);
})

app.post('/rooms/new', authenticateToken, async (req,res)=> {
    const {name, description, price} = req.body;
    const newRoom = new rooms({name, description, price, user: req.user.id});

    // Check the number of rooms already added by this user
    const roomCount = await rooms.countDocuments({ user: req.user.id });

    if (roomCount >= 2) {
        return res.status(400).json({ message: "You can only add up to 2 rooms. Please delete an existing room or use a different user ID." });
    }


    await newRoom.save();
    res.json({
        message:"Room created successfully"
    });
})

app.get('/rooms/:id', async (req,res)=>{
    const room = await rooms.findById(req.params.id);
    res.json(room);
})

app.delete('/rooms/:id', async (req,res)=>{
    await rooms.findByIdAndDelete(req.params.id);
    res.json({
        message:"Room deleted successfully"
    });
})


//User Registration
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



//User Login
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


// Route to get all products by a specific user
app.get('/users/:id/rooms', authenticateToken, async (req, res) => {
    try {
      const id = req.params.id;
      const userRooms = await rooms.find({ user: id });

      res.status(200).json(userRooms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


const port = 5000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
