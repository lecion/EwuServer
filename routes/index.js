/**
 * Created by Lecion on 12/21/15.
 */
var api = require('./api');
var setup = require('./setup');
module.exports = function (app) {
    app.use('/setup',setup);
    app.use('/api/auth', api.auth);
    app.use('/api/users', api.users);
    app.use('/order', function(req, res){
        res.sendFile('/Users/Lecion/Dev/node/EwuServer/app/views/mt.html')
    })
}