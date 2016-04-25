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
var tools          = require('../../common/functions')
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

//七牛
router.get('/qiniu/token', function (req, res) {

    var ak     = "na-bY0yuQFIy9ounupNbIhjdDVFJwwpqVO9S0r0l";
    var sk     = "p6ISNB1Gp7trbMUmAJJ4ITrK06yNE3tdK_WsjY48";
    var bucket = "lecion";

    var scope     = 'lecion';
    var curTime   = parseInt(Date.parse(new Date()).toString().substr(0, 10));
    var deadline  = curTime + 3600 * 24 * 60;
    var putPolicy = {
        "scope"    : scope,
        "deadline" : deadline,
        //"returnBody" : '{"name":$(fname), "size": $(fsize), "key": $(key)}'
    };

    var encoded = tools.getUpToken(ak, sk, putPolicy);

    res.api(encoded);
})

module.exports = router;