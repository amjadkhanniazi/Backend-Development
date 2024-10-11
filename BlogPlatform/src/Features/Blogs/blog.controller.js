const {Blog} = require('./blog.model');
const User = require('../Users/user.model');

//create a blog
const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const user = await User.findById(req.user.id)
        const blog = new Blog({ title, content, user: user._id });
        await blog.save();
        res.status(201).json({ message: "Blog Created" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

//delete a blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog.user.toString() === req.user.id) {
            await blog.deleteOne();
            res.status(200).json({ message: "Blog Deleted" });
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

//get a blog
const getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate({
            path: 'user',
            select: '-password -email' // exclude password email in the populated user field
        });
        res.status(200).json(blog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

//get all blogs
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate({
            path: 'user',
            select: '-password -email' // exclude password email in the populated user field
        });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

//update a blog
const updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        await Blog.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        res.status(200).json({ message: "Blog Updated" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}


module.exports = { 
    createBlog, deleteBlog, getBlog, getBlogs, updateBlog
};