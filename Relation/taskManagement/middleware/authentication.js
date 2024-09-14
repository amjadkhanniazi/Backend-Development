import jwt from 'jsonwebtoken';
import users from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'Unauthorized 11' });

    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if (err) return res.sendStatus(403);
        const temp = await users.findById(user.id);
        req.user = temp;
        next();
    });
};

export default authenticateToken;
