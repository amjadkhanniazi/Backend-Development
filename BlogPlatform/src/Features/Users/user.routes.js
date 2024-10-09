const userController = require('./user.controller');

const router = require('express').Router();

router.post('/register', userController.createUser);
router.post('/login', userController.Login);

module.exports = router;