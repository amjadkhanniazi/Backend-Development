import express from  'express';
import user from '../models/users.js'
import 'dotenv/config'

const router =  express.Router();

router.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const userExist = await user.findOne({username});
    if (userExist) {res.json({message: 'User Already Exist'})}
    try{
        const newUser = new user({username, password});
        await newUser.save();
        res.status(201).json({message: 'User Created Successfully'});
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
});

router.post('/login', async  (req, res) => {
    const {username, password} = req.body;
    try{
    const userExist = await user.findOne({username});
    if(!userExist) { 
        res.json({message: 'Invalid Credentials'});
    }

    const isMatch = await userExist.comparePassword(password);
    if(!isMatch) {
        res.json({message: 'Invalid Credentials'});
    }

    const token=userExist.getToken();
    res.json({token, userID: userExist._id})
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
})


export default router;
