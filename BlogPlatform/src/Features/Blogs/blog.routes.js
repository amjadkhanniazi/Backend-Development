const authenticateToken = require('../../Middlewares/auth.middleware');
const Blog= require('./blog.controller.js');

const router = require('express').Router();


router.post('/create', authenticateToken, Blog.createBlog);
router.delete('/delete/:id', authenticateToken, Blog.deleteBlog);
router.get('/get/:id', Blog.getBlog);
router.get('/get', Blog.getBlogs);
router.put('/update/:id', authenticateToken, Blog.updateBlog);




module.exports = router;