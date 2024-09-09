import express from "express";
import connectDB from "./config/db.js";
import Animals from "./models/animals.js";
import cors from "cors";
import user from "./models/user.js";
import 'dotenv/config';
import authenticateToken from "./middlewares/auth.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

connectDB();

app.get('/animals', authenticateToken, async (req,res)=>{
    const animals = await Animals.find();
    res.json(animals);
})

app.post('/animals/new', authenticateToken,async (req,res)=>{
    await Animals.create(req.body);
    res.json({
        message: 'Animal created'
    });
})

app.get('/animals/:id', authenticateToken,async (req,res)=>{
    const animal= await Animals.findById(req.params.id)
    res.json({animal});
})

app.delete('/animals/:id', authenticateToken,async (req,res)=>{
    await Animals.findByIdAndDelete(req.params.id);
    res.json({
        message: 'Animal deleted'
    });
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


app.listen(5009);