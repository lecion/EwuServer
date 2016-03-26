/**
 * Created by Lecion on 3/23/16.
 */
var router         = require('express').Router();
var authController = require('../controllers/AuthController');
var authMiddleware = require('../../middlewares/auth');
var user           = require('../controllers/UserController');
var goods          = require('../controllers/GoodsController');


//auth
router.post('/auth', authController.auth);
router.post('/auth/register', authController.register);

//users
router.get('/users', authMiddleware, user.list);
router.get('/user/:id', user.show);

//goods
router.get('/goods', goods.list);
router.get('/goods/:id', goods.show);
router.post('/goods', authMiddleware, goods.create);
//router.post('/goods', authMiddleware.auth, goods.create);


module.exports = router;