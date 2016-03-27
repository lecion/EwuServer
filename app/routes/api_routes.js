/**
 * Created by Lecion on 3/23/16.
 */
var router         = require('express').Router();
var authController = require('../controllers/AuthController');
var authMiddleware = require('../../middlewares/auth');
var user           = require('../controllers/UserController');
var goods          = require('../controllers/GoodsController');
var goods_collect  = require('../controllers/GoodsCollectController');

//auth
router.post('/auth', authController.auth);
router.post('/auth/register', authController.register);

//users
router.get('/users', authMiddleware, user.list);
router.get('/user/:id', user.show);

//goods
router.get('/goods', goods.index);
router.get('/goods/search', goods.search);
router.post('/goods', authMiddleware, goods.create);
//router.post('/goods', authMiddleware.auth, goods.create);

//goods_collect
router.post('/goods_collect/collect', authMiddleware, goods_collect.collect);
router.post('/goods_collect/de_collect', authMiddleware, goods_collect.deCollect);


module.exports = router;