/**
 * Created by Lecion on 3/28/16.
 */
var Reply                   = require('../models/Reply');
var EventProxy              = require('eventproxy');
exports.getRepliesByGoodsId = function (id, cb) {
    Reply.model.find({goods_id : id, deleted : false}, '', {sort : 'create_at'})
        .populate('from', 'name avatar')
        .populate('to', 'name avatar')
        .exec(function (err, replies) {
            if (err) return cb(err);
            if (replies.length === 0) {
                return cb(null, []);
            }
            return cb(null, replies);
        })
}

exports.newAndSave = function (content, goodsId, from, to, replyId, cb) {
    var reply      = new Reply.model;
    reply.content  = content;
    reply.goods_id = goodsId;
    reply.from     = from;
    reply.to       = to;
    reply.reply_id = replyId;
    reply.save(cb);
}

exports.getReplyById = function (id, cb) {
    Reply.one({_id : id}, cb);
}