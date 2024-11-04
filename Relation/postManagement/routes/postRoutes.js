const express = require('express');
const post = require('../models/post.js');
const logActivity = require('../middlewares/logActivity.js');
const authenticateToken = require('../middlewares/authentication.js');
const authorize = require('../middlewares/authorization.js');
const apiLimiter = require('../middlewares/apiLimiter.js');
const moment = require('moment');
const validatePost = require('../middlewares/validatePost.js');

const router = express.Router();


//get all posts, public api
router.get('/', async (req,res)=>{

  try{
    const posts = await post.find();
    res.json(posts);
  } 
  catch (error){
    res.status(500).json({error: error.message});
  }

});

//create/add a post, only user can do
router.post('/new', authenticateToken,authorize(['user','editor','admin']), async (req,res)=>{
  const {error} = validatePost(req.body);
  if(error) return res.status(400).json({error: error.details[0].message});

  try{
    const {title, content} = req.body;
    const userID= req.user.id;
    await logActivity('Blog post created', req.user?.id || 'Unknown user');
    const newPost = new post({title, content, user_id: userID, createdAt: moment().format('l')});

    await newPost.save();
    res.json({
        message:"Post Created Successfully"
    });
  }
  catch(error){
    res.status(500).json({error: error.message});
  }

});


//get a post by id
router.get('/:id', async (req, res)=>{
  
  try{
    
    const getPost=  await post.findById(req.params.id);
    res.json(getPost);
  }
  catch(error){
    res.status(500).json({error: error.message});
  }

});


//edit a post, only editor can do
router.put('/:id', authenticateToken, async (req, res)=>{

  try{
    const {title, content} = req.body;
    await post.findByIdAndUpdate(req.params.id, {title, content});
    await logActivity('Blog post Updated', req.user?.id || 'Unknown user');
    res.json({
        message:'Post Updated Successfully'
    });
  }
  catch(error){
    res.status(500).json({error: error.message});
  }

});


// delete a post, only admin can do
router.delete('/:id',  authenticateToken, async (req, res)=>{

  try{
    await  post.findByIdAndDelete(req.params.id);
    res.json({
        message: 'Post Deleted'
    });
  }
  catch(error){
    res.status(500).json({error: error.message});
  }
});


//get posts by a specific user
router.get('/user/:id', async  (req, res)=>{

  try{
    const id=req.params.id;
    const userPosts = await post.find({user_id: id}) //.select('_id title content');
    //res.json(userPosts);
    
    res.json(userPosts.map((post)=>({title: post.title, content: post.content})));
  }
  catch(error){
    res.status(500).json({error: error.message});
  }

})

module.exports = router;

