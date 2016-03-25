var User = require('../models/User');
var config = require('../../config.js');
var util = require('../../common/functions');

exports.list = function (req, res) {
    User.model.find({}, 'name phone avatar', function (err, users) {
        if (err) return res.api_error();
        res.api(users);
    })
}

exports.show = function (req, res) {
    User.model.findByName(req.params.id, function (err, user) {
        if (err) return res.api({}, util.s(config.s.USER_NOT_FOUND));
        res.api(user);
    })
}