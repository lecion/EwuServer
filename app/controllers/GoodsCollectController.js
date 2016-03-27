/**
 * Created by Lecion on 3/27/16.
 */
var GoodsCollect = require('../proxy/goods_collect');
var Goods        = require('../proxy/goods');
var User         = require('../proxy/user');
var EventProxy   = require('eventproxy');
var validator    = require('validator');
var util         = require('../../common/functions');
var conf         = require('../../config');

exports.collect = function (req, res, next) {
    var user    = req.decoded.user;
    var goodsId = req.body.goods_id;

    //验证
    if (!goodsId) {
        return res.api({}, util.s(conf.s.GC_ID_REQUIRED));
    }
    Goods.findById(goodsId, function (err, goods) {
        if (err) return next(err);
        if (!goods) {
            return res.api({}, util.s(conf.s.GOODS_NOT_EXIST));
        }

        GoodsCollect.getGoodsCollect(user, goodsId, function (err, doc) {
            if (err) return next(err);
            if (doc) return res.api("收藏成功");
            GoodsCollect.newAndSave(user, goodsId, function (err, doc) {
                if (err) return next(err);
                res.api("收藏成功");
            });
            User.addCollect(user, function (err) {
                if (err) return next(err);
            });
            goods.collect_count += 1;
            goods.save();
        });
    })
}

exports.deCollect = function (req, res, next) {
    var user    = req.decoded.user;
    var goodsId = req.body.goods_id;
    //验证
    if (!goodsId) {
        return res.api({}, util.s(conf.s.GC_ID_REQUIRED));
    }
    Goods.findById(goodsId, function (err, goods) {
        if (err) return res.api({}, util.s(conf.s.GOODS_NOT_EXIST));
        if (!goods) {
            return res.api({}, util.s(conf.s.GOODS_NOT_EXIST));
        }

        GoodsCollect.getGoodsCollect(user, goodsId, function (err, doc) {
            if (err) return next(err);
            if (!doc) return res.api({}, util.s(conf.s.GOODS_NOT_COLLECT));
            GoodsCollect.remove(user, goodsId, function (err) {
                if (err) return next(err);
                res.api("取消收藏成功");
            });
            User.decCollect(user, function (err) {
                if (err) return next(err);
            });
            goods.collect_count -= 1;
            goods.save();
        });
    })
}