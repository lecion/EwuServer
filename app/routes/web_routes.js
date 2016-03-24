/**
 * Created by Lecion on 3/23/16.
 */
var express = require('express');
var router = express.Router();
var auth = require('../../middlewares/auth');
var Goods = require('../models/Goods');
var util = require('../../common/functions');

router.get('/test', function (req, res) {
    res.send('this is test');
})


router['post']('/test/token/', function (req, res) {
    var name = req.body.name;
    var token = jwt.sign({user: name}, config.secret, {
        expiresIn: 10,
    })
    res.json({
        success: true,
        message: 'Welcome',
        token: token
    })
})

router.use('/test/auth',function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log('err ' + err)
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                req.decoded = decoded;
                util.dump(decoded);
                next();
            }
        })
    } else {
        return res.status(403).send({
            success: false,
            message: 'Please provide token.'
        });
    }
})

router['get']('/a', auth, function (req, res) {
    res.send('aaaaaaaa')
})

router.get('/goods/create', function(req, res, next) {
    Goods.create({
        name: "商品1",
        origin_price: 12.5,
        sale_price: 6,
        quality: "85新",
        intro: "大甩卖大甩卖"
    }, function(err, goods) {
        if (err) {
            return next(err);
        }
        console.log('新增商品成功');
        console.dir(goods);
        return res.send("新增商品成功:" + goods.name);
    });
})

router.get('/goods/update', function(req, res, next) {
    Goods.one({name: "商品1"}, function(err, goods) {
        if (err) return next(err)
        Goods.updateById(goods._id, {sale_price: 5, quality: "80新"}, function(err, result) {
            if (err) return next(err);
            console.dir(result);
            return res.send("更新商品成功" + result);
        })
    })
})

module.exports = router;