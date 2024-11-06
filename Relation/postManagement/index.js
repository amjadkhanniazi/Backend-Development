const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/auth.js');
const postRoutes = require('./routes/postRoutes.js');
const apiLimiter = require('./middlewares/apiLimiter.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app=express();


const corsOptions = {
    origin: ['https://yourdomain.com', 'http://localhst:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600 // 10 minutes, 600 Seconds
};

// Serve Swagger UI on a route, e.g., /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));

connectDB();

// Routes
app.use('/user', userRoutes);
app.use('/post', postRoutes);

app.listen(5000,  () => {
    console.log('server is running on http://localhost:5000');
})




