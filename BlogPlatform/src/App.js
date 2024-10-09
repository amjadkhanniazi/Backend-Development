const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db.js');
const dotenv = require('dotenv');
const userRoutes = require('./Features/Users/user.routes');
const blogRoutes = require('./Features/Blogs/blog.routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();

app.use('/auth', userRoutes);
app.use('/blog', blogRoutes);


app.listen(5000,
    console.log('http://localhost:5000')
)