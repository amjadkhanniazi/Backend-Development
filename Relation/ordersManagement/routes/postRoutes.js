import express from  'express';
import post from '../models/post.js';
import user from '../models/user.js'
import authenticateToken from '../middlewares/authentication.js';
import authorize from '../middlewares/authorization.js';

const router = express.Router();


//get all posts, public api
router.get('/', async (req,res)=>{
    const posts = await posts.find();
    res.json(posts);
});

//create/add a post, only user can do
// router.post('/new', authenticateToken,authorize['user'], async (req,res)=>{
//     const {title, content} = req.body;
//     const userID= req.user.id;
//     const newPost = new post({title, content, user: userID});
//     await newPost.save();
//     res.json({
//         message:"Post Created Successfully"
//     });
// });


router.post('/new', authenticateToken, authorize(['editor', 'admin']), async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;
    const newPost = new fruits({
      title,
      content,
      user: userId
    });
    await newPost.save();
    res.json({
      message: 'fruit added successfully'
    });
  });








//get a post by id
router.get('/:id', async (req, res)=>{
    const getPost=  await post.findById(req.params.id);
    res.json(getPost);
})


//edit a post, only editor can do
// router.put('/:id', authenticateToken, authorize['editor'], async (req, res)=>{
//     const {title, content} = req.body;
//     await user.findByIdAndUpdate(req.params.id, {title, content});
//     res.json({
//         message:'Post Updated Successfully'
//     });
// });


router.put('/:id', authenticateToken, authorize(['editor', 'admin']), async (req, res) => {
    const { title,  content } = req.body;

    await post.findByIdAndUpdate(req.params.id, { title, content });
    res.json({
      message: 'fruit updated successfully'
    });
  });













// delete a post, only admin can do
router.delete('/:id',  authenticateToken, authorize(['admin']), async (req, res)=>{
    await  post.findByIdAndDelete(req.params.id);
    res.json({
        message: 'Post Deleted'
    });
});


// router.delete('/:id', authenticateToken, authorize(['admin']), async (req, res) => {
//     await post.findByIdAndDelete(req.params.id);
//     res.json({
//       message: 'fruit deleted successfully'
//     });
//   });















//get posts by a specific user
router.get('/user/:id', authenticateToken, async  (req, res)=>{
    const id=req.params.id;
    const userPosts = await post.find({user: id});
    res.status(200).json(userPosts);
})


export default router;

