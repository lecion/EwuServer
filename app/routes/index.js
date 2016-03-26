/**
 * Created by Lecion on 12/21/15.
 */
var api        = require('./api_routes');
var setup      = require('./setup');
var web        = require('./web_routes');
module.exports = function (app) {
    app.use('/api', api);
    app.use('/', web);
}