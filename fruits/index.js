import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import fruits from './models/fruits.js';
import user from './models/user.js';
import 'dotenv/config';
import authenticateToken from './middlewares/auth.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

connectDB();

app.get('/fruits', authenticateToken,async (req,res)=>{
    const allFruits = await fruits.find();
    res.json(allFruits);
})

app.post('/fruits/new', async (req,res)=>{
    await fruits.create(req.body);
    res.json({
        message:"Record Created"
    })
})

app.get('/fruits/:id', authenticateToken, async (req, res) => {
    const fruit= await fruits.findById(req.params.id);
    res.json(fruit);
})

app.delete('/fruits/:id', async (req,res)=>{
    await fruits.findByIdAndDelete(req.params.id);
    res.json({
        message:"Record Deleted"
    })
})

//Register New User
app.post('/register', async (req,res)=>{
    const {username, password} = req.body;
    try{
        const newUser = new user({username,password});
        await newUser.save();
        res.status(200).json({message:"User Created"});
    }
    catch(err){
        res.status(500).json({message:"Server Error", error:err.message});
    }
})

//Login User
app.post('/login', async (req,res)=>{
    const {username, password}=req.body;
    try{
        const newUser= await  user.findOne({username});
        if (!newUser) res.status(400).json({error: 'Invalid Credentials'});

        const isMatch= await newUser.comparePassword(password);
        if (!isMatch) res.status(400).json({error: 'Invalid Credentials'});

        const token = newUser.getToken();
        res.json({token})
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
})



app.listen(5007);