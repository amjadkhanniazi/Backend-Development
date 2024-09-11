import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import users from '../models/users.js';

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if (err) return res.sendStatus(403);
        const temp= await users.findById(user.id)
        req.user = temp;
        next();
    });
};

export default authenticateToken;

