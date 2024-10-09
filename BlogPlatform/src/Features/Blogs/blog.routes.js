const authenticateToken = require('../../Middlewares/auth.middleware');
const Blog= require('./blog.controller.js');

const router = require('express').Router();


router.post('/create', authenticateToken, Blog.createBlog);



module.exports = router;