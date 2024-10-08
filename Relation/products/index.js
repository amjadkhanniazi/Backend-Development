import express from 'express';
import cors from 'cors';
import products from './models/products.js';
import connectDB from './config/db.js';
import user from './models/users.js';
import 'dotenv/config';
import authenticateToken from './middlewares/auth.js';
import authorize from './middlewares/authorization.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectDB();


app.get('/products', authenticateToken,async (req,res)=>{
    const product = await products.find();
    res.json(product);
})


app.post('/products/new', authenticateToken, authorize(['editor', 'admin']),async (req,res)=>{
    const { name, price, description }  = new products(req.body);
    const userId = req.user.id; 
    const newProduct = new products({
        name,
        price,
        description,
        user: userId
    });

    await newProduct.save();

    res.json({
        message: 'Product added successfully'
    });
})

app.get('/products/:id', authenticateToken, authorize(['editor', 'admin','user']), async (req, res) => {
    const product= await products.findById(req.params.id);
    res.json(product);
})

app.delete('/products/:id', authenticateToken, authorize(['admin']), async (req, res) => {
    await products.findByIdAndDelete(req.params.id);
    res.json({
        message: 'Product deleted successfully'
    });
})


// Route to get all products by a specific user
app.get('/users/:id/products', authenticateToken, async (req, res) => {
    try {
      const id = req.params.id;
      const userProduct = await products.find({ user: id });

      res.status(200).json(userProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


//User Registration
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
      const newUser = new user({ username, password, role });
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




app.listen(5000, ()=>{console.log('http://localhost:5000');
});