/**
 * Created by Lecion on 3/27/16.
 */
var GoodsCollect        = require('../models/GoodsCollect');
exports.getGoodsCollect = function (user_id, goods_id, cb) {
    GoodsCollect.one({user_id : user_id, goods_id : goods_id}, cb);
}

exports.newAndSave = function (user_id, goods_id, cb) {
    var gc      = new GoodsCollect.model;
    gc.user_id  = user_id;
    gc.goods_id = goods_id;
    gc.save(cb);
}

exports.remove = function (uid, gid, cb) {
    GoodsCollect.delete({user_id : uid, goods_id : gid}, cb);
}

exports.findByUserId = function (uid, cb) {
    GoodsCollect.model.find({user_id : uid})
        .populate('goods_id', 'name')
        .exec(cb);
}