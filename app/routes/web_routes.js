/**
 * Created by Lecion on 3/23/16.
 */
var express  = require('express');
var router   = express.Router();
var auth     = require('../../middlewares/auth');
var Goods    = require('../models/Goods');
var util     = require('../../common/functions');
var Category = require('../models/Category');
router.get('/test', function (req, res) {
    res.send('this is test');
})


router['post']('/test/token/', function (req, res) {
    var name  = req.body.name;
    var token = jwt.sign({user : name}, config.secret, {
        expiresIn : 10,
    })
    res.json({
        success : true,
        message : 'Welcome',
        token   : token
    })
})

router.use('/test/auth', function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log('err ' + err)
                return res.json({success : false, message : 'Failed to authenticate token.'});
            } else {
                req.decoded = decoded;
                util.dump(decoded);
                next();
            }
        })
    } else {
        return res.status(403).send({
            success : false,
            message : 'Please provide token.'
        });
    }
})

router['get']('/a', auth, function (req, res) {
    res.send('aaaaaaaa')
})

router.get('/goods/create', function (req, res, next) {
    Goods.create({
        name         : "商品1",
        origin_price : 12.5,
        sale_price   : 6,
        quality      : "85新",
        intro        : "大甩卖大甩卖"
    }, function (err, goods) {
        if (err) {
            return next(err);
        }
        console.log('新增商品成功');
        console.dir(goods);
        return res.send("新增商品成功:" + goods.name);
    });
})

router.get('/goods/update', function (req, res, next) {
    Goods.one({name : "商品1"}, function (err, goods) {
        if (err) return next(err)
        Goods.updateById(goods._id, {sale_price : 5, quality : "80新"}, function (err, result) {
            if (err) return next(err);
            console.dir(result);
            return res.send("更新商品成功" + result);
        })
    })
})

router.delete('/test/goods/', function (req, res, next) {
    Goods.deleteAll(function (err) {
        if (err) return next(err);
        res.api("删除成功");
    })
})


router.get('/test/category/add', function (req, res, next) {
    var parent = req.query.parent || null;
    var name   = req.query.name || '';
    if (name === '') {
        return res.api_error("名字不能为空");
    }
    if (parent) {

        Category.one({name : parent}, function (err, category) {
            if (err) return next(err);
            var parent_id = null;
            if (category) {
                parent_id = category._id;
            }
            Category.create({
                name   : name,
                parent : parent_id
            }, function (err, category) {
                if (err) return next(err);
                res.api(category);
            });
        })
    } else {
        Category.create({
            name : name,
        }, function (err, category) {
            if (err) return next(err);
            res.api(category);
        })
    }
})

router.get('/test/category', function (req, res, next) {
    Category.model.find({}, 'name parent', function (err, categories) {
        if (err) return next(err);
        res.api(categories);
    })

})

router.get('/test/category/tree', function (req, res, next) {
    Category.model.find({}, 'name parent', function (err, categories) {
        if (err) next(err);
        //var tree;
        //tree = sortOut(categories, null, 0);
        res.api(categories)
    })
})
module.exports = router;