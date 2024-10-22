import express from  'express';
import post from '../models/post.js';
import authenticateToken from '../middlewares/authentication.js';
import authorize from '../middlewares/authorization.js';
import apiLimiter from '../middlewares/apiLimiter.js';
import moment from 'moment';
import validatePost from '../middlewares/validatePost.js';

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
router.put('/:id', authenticateToken, authorize(['editor']), async (req, res)=>{

  try{
    const {title, content} = req.body;
    await post.findByIdAndUpdate(req.params.id, {title, content});
    res.json({
        message:'Post Updated Successfully'
    });
  }
  catch(error){
    res.status(500).json({error: error.message});
  }

});


// delete a post, only admin can do
router.delete('/:id',  authenticateToken, authorize(['admin']), async (req, res)=>{

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


export default router;

