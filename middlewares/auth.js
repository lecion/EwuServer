var config = require('../config');
var util   = require('../common/functions');
var jwt    = require('jsonwebtoken');

module.exports = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.api({}, util.s(config.s.INVALID_TOKEN));
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        return res.api({}, util.s(config.s.TOKEN_NOT_FOUND));
    }
}