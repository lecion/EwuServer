/**
 * Created by Lecion on 3/28/16.
 */
var validator  = require('validator');
var util       = require('../../common/functions');
var conf       = require('../../config');
var Goods      = require('../proxy/goods');
var Reply      = require('../proxy/reply');
var EventProxy = require('eventproxy');
var User       = require('../proxy/user');

exports.create = function (req, res, next) {
    var goodsId = String(req.params.id);
    var content = req.body.content || '';
    var replyId = req.body.reply_id || null;

    if (!validator.isMongoId(goodsId)) {
        return res.api({}, util.s(conf.s.GOODS_INVALID_ID));
    }

    if (replyId !== null && !validator.isMongoId(replyId)) {
        return res.api({}, util.s(conf.s.REPLY_INVALID_ID));
    }

    var str = validator.trim(content);
    if (str === '') {
        return res.api({}, util.s(conf.s.REPLY_CONTENT_REQUIRED));
    }

    var ep = new EventProxy();
    ep.fail(next);

    Goods.findById(goodsId, ep.done(function (goods) {
        if (!goods) {
            return res.api({}, util.s(conf.s.GOODS_NOT_EXIST));
        }

        if (goods.status != 0) {
            return res.api({}, util.s(conf.s.GOODS_SALED));
        }

        ep.emit('goods', goods);
    }));

    Reply.getReplyById(replyId, ep.done(function (reply) {
        var toUser = null;
        if (reply) {
            toUser = reply.from;
        }
        ep.emit('toUser', toUser);
    }));

    ep.all('goods', 'toUser', function (goods, toUser) {
        Reply.newAndSave(content, goods._id, req.decoded.user, toUser, replyId, ep.done('reply_saved'))
        goods.reply_count += 1;
        goods.save();
    });


    ep.all('reply_saved', function (reply) {
        User.addReply(reply.from, ep.done(function () {
            return res.api("回复成功");
        }));
    })

}