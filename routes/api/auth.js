var express = require('express');
var router = express.Router();
var User = require('../../app/models/User');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var bcrypt = require('bcrypt');
var util = require('../../common/functions');
//auth
router.post('/', function (req, res) {
    User.findOne({
        name: req.body.name,
    }, function (err, user) {
        if (err) return res.api_error({name: name});
        if (!user) {
            return res.api({}, util.getStatus(config.status.USER_NOT_EXIST));
        } else if (user) {
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                res.api({}, util.getStatus(config.status.WRONG_PASSWORD));
            } else {
                //生成token
                var token = jwt.sign({user: user._id}, config.secret, {
                    expiresIn: config.token_expire,
                })
                return res.api({token: token});
            }
        }
    })
})

router.post('/register', function (req, res) {
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
            return res.api({}, {
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
})

module.exports = router;