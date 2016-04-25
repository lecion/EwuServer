/**
 * Created by Lecion on 3/26/16.
 */
var Goods          = require('../models/Goods');
var EventProxy     = require('eventproxy');
var Reply          = require('../proxy/reply');
exports.newAndSave = function (name, detail, pictures, category, seller, origin_price, sale_price, location, cb) {
    var goods          = new Goods.model();
    goods.name         = name;
    goods.detail       = detail;
    goods.pictures     = pictures;
    goods.category     = category
    goods.seller       = seller;
    goods.origin_price = origin_price;
    goods.sale_price   = sale_price;
    goods.location     = location;

    goods.save(cb);
};

exports.findById = function (id, cb) {
    Goods.one({_id : id}, cb);
}

exports.getFullGoods = function (id, cb) {
    var ep     = new EventProxy();
    var events = ['goods', 'replies'];

    ep.assign(events, function (goods, replies) {
            cb(null, '', goods, replies);
        })
        .fail(cb);

    Goods.model.findOne({_id : id})
        .populate('seller', 'avatar name')
        .populate('category', '_id name')
        .exec(ep.done(function (goods) {
            if (!goods) {
                ep.unbind;
                return cb(null, '此商品不存在或已被删除');
            }
            ep.emit('goods', goods);
            Reply.getRepliesByGoodsId(goods._id, ep.done('replies'));
        }));
}