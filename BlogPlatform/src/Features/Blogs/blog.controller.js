const Blog = require('./blog.model');
const User = require('../Users/user.model');

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


module.exports = { createBlog };