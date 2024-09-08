import express from "express";
import connectDB from "./config/db.js";
import Animals from "./models/animals.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

connectDB();

app.get('/animals', async (req,res)=>{
    const animals = await Animals.find();
    res.json(animals);
})

app.post('/animals/new',async (req,res)=>{
    await Animals.create(req.body);
    res.json({
        message: 'Animal created'
    });
})

app.get('/animals/:id',async (req,res)=>{
    const animal= await Animals.findById(req.params.id)
    res.json({animal});
})

app.delete('/animals/:id',async (req,res)=>{
    await Animals.findByIdAndDelete(req.params.id);
    res.json({
        message: 'Animal deleted'
    });
})

app.listen(5009);