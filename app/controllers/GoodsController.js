/**
 * Created by Lecion on 3/23/16.
 */
var Goods      = require('../models/Goods');
var GoodsProxy = require('../proxy/goods')
var EventProxy = require('eventproxy');
var validator  = require('validator');
var util       = require('../../common/functions');
var conf       = require('../../config');
exports.index  = function (req, res, next) {
    var ep = new EventProxy();
    ep.fail(next);

    var page  = parseInt(req.query.page, 10) || 1;
    page      = page > 0 ? page : 1;
    var limit = Number(req.query.limit) || conf.list_goods_count;

    //1 => 热度, 2 => 时间, 3 => 价格
    var sortType = Number(req.query.sort) || 1;


    var query = {};

    var projection = 'name detail sale_price seller';

    var sort = '-collect_count';
    if (sortType === 2)
        sort = '-update_at';
    if (sortType === 3)
        sort = 'sale_price -update_at';

    var options = {skip : (page - 1) * limit, limit : limit, sort : sort};

    Goods.model.find(query, projection, options)
        .populate('seller', 'name avatar')
        .exec(ep.done(function (goods) {
            res.api(goods);
        }));
    //
    //Goods.model.find({})
    //    .populate('seller', 'name avatar')
    //    .exec(ep.done(function (goods) {
    //        res.api(goods);
    //    }))
}

exports.show = function (req, res) {
    //TODO 商品
}


exports.create = function (req, res, next) {

    var name       = req.body.name ? validator.trim(req.body.name) : '';
    var detail     = req.body.detail ? validator.trim(req.body.detail) : '';
    var sale_price = req.body.sale_price ? validator.trim(req.body.sale_price) : '';
    var type       = req.body.type ? req.body.type : -1;

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

    GoodsProxy.newAndSave(name, detail, null, seller, 0, sale_price, null, function (err, goods) {
        if (err) return next(err)
        return res.api(goods);
    })

}