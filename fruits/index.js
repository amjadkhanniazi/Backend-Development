import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import fruits from './models/fruits.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

connectDB();

app.get('/fruits',async (req,res)=>{
    const allFruits = await fruits.find();
    res.json(allFruits);
})

app.post('/fruits/new', async (req,res)=>{
    await fruits.create(req.body);
    res.json({
        message:"Record Created"
    })
})

app.get('/fruits/:id', async (req,res)=>{
    const fruit= await fruits.findById(req.params.id);
    res.json(fruit);
})

app.delete('/fruits/:id', async (req,res)=>{
    await fruits.findByIdAndDelete(req.params.id);
    res.json({
        message:"Record Deleted"
    })
})

app.listen(5007);