var express    = require('express');
var path       = require('path');
var favicon    = require('serve-favicon');
var logger     = require('morgan');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var config     = require('./config');
var routes     = require('./app/routes');
var res_api    = require('res.api');
var app        = express();

//db
mongoose.connect(config.db);

var db = mongoose.connection;

db.on('open', function (err) {
    if (err) console.log('mongoose database open with err');
    console.log('mongodb open success');
})

app.use(function (req, res, next) {
    req.db = db;
    next();
})


app.set('superSecret', config.secret);

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(res_api)
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err    = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.set('showStackError', true);
    app.use(logger(':method :url :status'))
    app.locals.pretty = true
    mongoose.set('debug', true)
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message : err.message,
            error   : err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message : err.message,
        error   : {}
    });
});

module.exports = app;
