import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import products from './models/products.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

connectDB();

app.get('/products', async (req,res)=>{
    const product= await products.find();
    res.json(
        {product}
    );
})

app.post('/products/new',async (req,res) => {
    const newProduct=req.body;
    await products.create(newProduct);
    res.json({
        message: 'Product added'
    });
})

app.get('/products/:id', async (req,res) => {
    const product=await products.findById(req.params.id);
    res.json({
        product
    });
})

app.delete('/products/:id', async (req,res) =>{
    await products.findByIdAndDelete(req.params.id);
    res.json({
        message: 'Product deleted'
    });
})

app.listen(5011,()=>console.log('http://localdb:5011'));
