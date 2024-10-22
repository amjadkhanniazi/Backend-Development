const { Blog } = require('../Blogs/blog.model.js');  // Ensure correct path


// Add comment
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // const comment = await Comment.create({ content, user: req.user._id }); // Use the Comment model
        blog.comments.push({ content, user: req.user._id });  // Push the comment's ObjectId
        await blog.save();
        
        res.status(201).json({ message: "Comment Added" });
    } catch (err) {
        res.status(400).json({ message: 'Hello '+ err.message });
    }
};

//delete a comment
const deleteComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.query.blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

      
        const comment = blog.comments.find(comment => comment._id.toString() === req.query.commentId);

        // if comment is not found
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
          // see comment is done by user who is deleting it
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        blog.comments = blog.comments.filter(comment => comment._id.toString() !== req.query.commentId);
        await blog.save();
        await comment.deleteOne();
        res.status(200).json({ message: "Comment Deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//update comment by the user who created it
const updateComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.query.blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        } 
        const comment = blog.comments.find(comment => comment._id.toString() === req.query.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        comment.content = req.body.content;
        await blog.save();
        res.status(200).json({ message: "Comment Updated" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

//get all comments of a blog
const getComments = async (req, res) => {
    try {
        const blog = await Blog.findById(req.query.blogId).populate({ path: 'comments.user', select: '_id' });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        } 
        res.status(200).json(blog.comments);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}


module.exports = { addComment, deleteComment, updateComment, getComments };