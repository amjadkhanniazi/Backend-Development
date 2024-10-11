const authenticateToken = require('../../Middlewares/auth.middleware');
const Blog= require('./blog.controller.js');
const Comments = require('../Comments/comments.controller.js');

const router = require('express').Router();


router.post('/create', authenticateToken, Blog.createBlog);
router.delete('/delete/:id', authenticateToken, Blog.deleteBlog);
router.get('/get/:id', Blog.getBlog);
router.get('/get', Blog.getBlogs);
router.put('/update/:id', authenticateToken, Blog.updateBlog);

router.post('/comment/:id', authenticateToken, Comments.addComment);
router.delete('/comment/delete', authenticateToken, Comments.deleteComment);
router.put('/comment/update', authenticateToken, Comments.updateComment);
router.get('/comments', Comments.getComments);






module.exports = router;