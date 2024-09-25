import jwt from 'jsonwebtoken';
import user from '../models/user.js';
import 'dotenv/config';

dotenv.config();

const authenticateToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({message:'Unauthorized'});

    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if(err) return res.status(403).json({message:'Error Verifying Token'});
        req.user = await user.findById(user.id);
        next();
    })
}

export default authenticateToken;