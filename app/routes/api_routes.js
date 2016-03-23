/**
 * Created by Lecion on 3/23/16.
 */
var router = require('express').Router();
var authController = require('../controllers/AuthController');
var authMiddleware = require('../../middlewares/auth');
var User = require('../controllers/UserController');


//auth
router.post('/auth', authController.auth);
router.post('/auth/register', authController.register);

//users
router.get('/users', authMiddleware, User.list);
router.get('/user/:id', User.show);

module.exports = router;