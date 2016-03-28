/**
 * Created by Lecion on 3/23/16.
 */
var router         = require('express').Router();
var authController = require('../controllers/AuthController');
var authMiddleware = require('../../middlewares/auth');
var user           = require('../controllers/UserController');
var goods          = require('../controllers/GoodsController');
var goods_collect  = require('../controllers/GoodsCollectController');
var reply          = require('../controllers/ReplyController');
//auth
router.post('/auth', authController.auth);
router.post('/auth/register', authController.register);

//users
router.get('/users', authMiddleware.auth, user.list);
router.get('/user/:id', user.show);

//goods
router.get('/goods', goods.index);
router.get('/goods/search', goods.search);
router.get('/goods/:id', authMiddleware.tryAuth, goods.show);
router.post('/goods', authMiddleware.auth, goods.create);

//评论
router.post('/goods/:id/reply', authMiddleware.auth, reply.create);
//router.post('/goods', authMiddleware.auth, goods.create);

//goods_collect
router.get('/goods_collects', authMiddleware.auth, goods_collect.index);
router.post('/goods_collect/collect', authMiddleware.auth, goods_collect.collect);
router.post('/goods_collect/de_collect', authMiddleware.auth, goods_collect.deCollect);


module.exports = router;