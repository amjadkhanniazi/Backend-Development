const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();

app.listen(5000,
    console.log('http://localhost:5000')
)