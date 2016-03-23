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

    User.findOne({name: req_name}, ep.done(function (user) {
        if (!user) {
            res.api({}, util.getStatus(config.status.USER_NOT_EXIST))
        } else {
            if (bcrypt.compareSync(req_password, user.password)) {
                //生成token
                var token = jwt.sign({user: user._id}, config.secret, {
                    expiresIn: config.token_expire,
                })
                res.api({token: token});
            } else {
                res.api({}, util.getStatus(config.status.WRONG_PASSWORD));
            }
        }
    }))
}

exports.register = function (req, res) {
    var name = req.body.name,
        password = req.body.password;
    if (!name || name.length <= 3) {
        return res.api({}, {
            code: config.status.INVALIDE_NAME[0],
            msg: config.status.INVALIDE_NAME[1],
        })
    }
    if (!password || password.length <= 5) {
        return res.api({}, {
            code: config.status.INVALIDE_PASSWORD[0],
            msg: config.status.INVALIDE_PASSWORD[1],
        })
    }
    User.findByName(name, function (err, user) {
        if (user) {
            //已经存在该用户
            res.api({}, {
                code: config.status.USER_EXIST[0],
                msg:  config.status.USER_EXIST[1] + ": " + name,
            })
        } else {
            var _user = new User({
                name: name,
                password: password,
            });
            _user.save(function (err) {
                if (err) return res.api(err, {
                    code: err.code,
                    msg: err.message,
                });
                return res.api(_user);
            })
        }
    })
}