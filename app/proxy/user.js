/**
 * Created by Lecion on 3/27/16.
 */
var User = require('../models/User');

exports.addCollect = function (uid, cb) {
    User.one({_id : uid}, function (err, user) {
        if (err) return cb(err);
        user.collect_count += 1;
        user.save();
    })
}

exports.decCollect = function (uid, cb) {
    User.one({_id : uid}, function (err, user) {
        if (err) return cb(err);
        user.collect_count -= 1;
        user.save();
    })
}