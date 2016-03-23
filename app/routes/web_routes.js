/**
 * Created by Lecion on 3/23/16.
 */
var express = require('express');
var router = express.Router();
var auth = require('../../middlewares/auth');


router.get('/test', function (req, res) {
    res.send('this is test');
})


router['post']('/test/token/', function (req, res) {
    var name = req.body.name;
    var token = jwt.sign({user: name}, config.secret, {
        expiresIn: 10,
    })
    res.json({
        success: true,
        message: 'Welcome',
        token: token
    })
})

router.use('/test/auth',function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log('err ' + err)
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                req.decoded = decoded;
                util.dump(decoded);
                next();
            }
        })
    } else {
        return res.status(403).send({
            success: false,
            message: 'Please provide token.'
        });
    }
})

router['get']('/a', auth, function (req, res) {
    res.send('aaaaaaaa')
})

module.exports = router;