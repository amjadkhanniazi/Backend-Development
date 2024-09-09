import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import products from './models/products.js';
import user from './models/user.js';
import 'dotenv/config';
import authenticateToken from './middlewares/auth.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

connectDB();

app.get('/products', authenticateToken, async (req, res) => {
    const product = await products.find();
    res.json(
        { product }
    );
})

app.post('/products/new', authenticateToken, async (req, res) => {
    const newProduct = req.body;
    await products.create(newProduct);
    res.json({
        message: 'Product added'
    });
})

app.get('/products/:id', authenticateToken, async (req, res) => {
    const product = await products.findById(req.params.id);
    res.json({
        product
    });
})

app.delete('/products/:id', authenticateToken, async (req, res) => {
    await products.findByIdAndDelete(req.params.id);
    res.json({
        message: 'Product deleted'
    });
})

// register new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try{
        const newUser= new user({username,password});
        await newUser.save();
        res.status(200).json({message:'User Created'});
    } catch(error){
        res.status(400).json({error: error.message});
    }
});

// login
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

app.listen(5011);
