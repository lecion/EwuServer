/**
 * Created by Lecion on 3/28/16.
 */
var Reply                   = require('../models/Reply');
var EventProxy              = require('eventproxy');
exports.getRepliesByGoodsId = function (id, cb) {
    Reply.model.find({goods_id : id, deleted : false}, '', {sort : 'create_at'}, function (err, replies) {
        if (err) return cb(err);
        if (replies.length === 0) {
            return cb(null, []);
        }

        var ep = new EventProxy();
        ep.after('reply_find', replies.length, function () {
            cb(null, replies);
        });
        //TODO 查找评论逻辑
    })
}
