/**
 * Created by Lecion on 3/23/16.
 */

var EventProxy = require('eventproxy');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var util = require('../../common/functions');
var config = require('../../config');
var User = require('../models/User');

exports.auth = function (req, res, next) {
    var ep = new EventProxy();
    ep.fail(next);

    var req_name = req.body.name || '';
    var req_password = req.body.password || '';

    User.one({name: req_name}, ep.done(function (user) {
        if (!user) {
            res.api({}, util.s(config.s.USER_NOT_EXIST))
        } else {
            if (bcrypt.compareSync(req_password, user.password)) {
                //生成token
                var token = jwt.sign({user: user._id}, config.secret, {
                    expiresIn: config.token_expire,
                })
                res.api({token: token});
            } else {
                res.api({}, util.s(config.s.WRONG_PASSWORD));
            }
        }
    }))
}

exports.register = function (req, res, next) {
    var ep = new EventProxy();
    ep.fail(next);

    var name = req.body.name,
        password = req.body.password;
    if (!name || name.length <= 3) {
        return res.api({}, {
            code: config.s.INVALIDE_NAME[0],
            msg: config.s.INVALIDE_NAME[1],
        })
    }
    if (!password || password.length <= 5) {
        return res.api({}, {
            code: config.s.INVALIDE_PASSWORD[0],
            msg: config.s.INVALIDE_PASSWORD[1],
        })
    }
    User.one({name: name}, ep.done(function (user) {
        if (user) {
            //已经存在该用户
            res.api({}, {
                code: config.s.USER_EXIST[0],
                msg:  config.s.USER_EXIST[1] + ": " + name,
            })
        } else {
            var _user = new User.model({
                name: name,
                password: password,
            });
            _user.save(ep.done(function() {
                return res.api(_user);
            }));
        }
    }))
}