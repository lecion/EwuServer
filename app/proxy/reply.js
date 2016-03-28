/**
 * Created by Lecion on 3/28/16.
 */
var Reply                   = require('../models/Reply');
var EventProxy              = require('eventproxy');
exports.getRepliesByGoodsId = function (id, cb) {
    Reply.model.find({goods_id : id, deleted : false}, '', {sort : 'create_at'})
        .populate('from', 'name')
        .populate('to', 'name')
        .exec(function (err, replies) {
            if (err) return cb(err);
            if (replies.length === 0) {
                return cb(null, []);
            }
            return cb(null, replies);
        })
}
