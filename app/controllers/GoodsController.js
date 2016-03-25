/**
 * Created by Lecion on 3/23/16.
 */
var Goods = require('../models/Goods');
var EventProxy = require('eventproxy');
var validator = require('validator');
var util = require('../../common/functions');
var conf = require('../../config');
exports.list = function (req, res, next) {
    var ep = new EventProxy();
    ep.fail(next);
    //Goods.all(ep.done(function(goods) {
    //    res.api(goods);
    //}))
    Goods.model.find({})
        .populate('seller', 'name avatar')
        .exec(ep.done(function(goods) {
        res.api(goods);
    }))
}

exports.show = function (req, res) {

}


exports.create = function (req, res, next) {

    var name = req.body.name ? validator.trim(req.body.name) : '';
    var detail = req.body.detail ? validator.trim(req.body.detail) : '';
    var sale_price = req.body.sale_price ? validator.trim(req.body.sale_price) : '';
    var type = req.body.type ? req.body.type : -1;

    var seller = req.decoded.user;

    //验证
    var err;
    if (name === '') {
        err = conf.s.GOODS_NAME_REQUIRED;
    } else if (detail === '') {
        err = conf.s.GOODS_DETAIL_REQUIRED;
    } else if (sale_price == '') {
        err = conf.s.GOODS_PRICE_REQUIRED;
    } else if (type === -1) {
        err = conf.s.GOODS_TYPE_REQUIRED;
    }

    if (err) {
        return res.api({}, util.s(err));
    }

    Goods.create({
        name: name,
        detail: detail,
        sale_price: sale_price,
        //type: type,
        seller: seller,
    }, function (err, goods) {
        if (err) return next(err);
        return res.api(goods);
    });

    //res.api(seller + " 创建商品成功")
}