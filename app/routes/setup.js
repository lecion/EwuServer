var express = require('express');
var router = express.Router();
var User = require('../models/User');
var utils = require('../../common/functions');


router.get('/', function (req, res) {
    var user = new User({
    name: 'aaaa',
    password: 'passsa',
    phone: '15608000252'
});
user.save(function (err) {
    if (err) return res.api(err, {
        code: err.code,
        msg: err.message,
    });
    return res.api(user);
})
})

module.exports = router;