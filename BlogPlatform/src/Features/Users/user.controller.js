const User = require('./user.model.js');
const validateUser = require('../../Middlewares/validateUser.middlewares');

const createUser = async (req, res) => {

    const {error} = validateUser(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});


    try{
        const {name, email, password} = req.body;
        const user = new User({name, email, password});
        await user.save();
        res.status(201).json({message: "User Created"});
    } catch(err){
        res.status(400).json({message: err.message});
    }
}

const Login = async (req, res) => {
    try{
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Email or Password' });
    const validPassword = await user.comparePassword(password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid Email or Password' });
    const token = user.getToken();
    res.status(200).json({ token });
    } catch(err){
        res.status(400).json({message: err.message});
    }
}

module.exports = {createUser, Login};