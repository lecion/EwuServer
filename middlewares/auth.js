var config   = require('../config');
var util     = require('../common/functions');
var jwt      = require('jsonwebtoken');
exports.auth = function (req, res, next) {
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

/**
 * 非登陆用户也允许查看
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.tryAuth = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                //即使token错误也可以继续访问
                return next();
            } else {
                req.decoded = decoded;
                return next();
            }
        })
    } else {
        return next();
    }
}