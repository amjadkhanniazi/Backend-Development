const mongoose = require('mongoose');
const { commentSchema } = require('../Comments/comments.model');

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    comments: [commentSchema], // Use the schema, not the model
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

const Blog = mongoose.model('Blog', blogSchema);
module.exports = {Blog};