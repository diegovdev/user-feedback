const createError     = require('http-errors');
const express         = require('express');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const lessMiddleware  = require('less-middleware');
const httpLogger      = require('morgan');


//--loading own libraries-----------------------------------------------------------------------------------------------
const webAppRouter = require('./routers/webAppRouter');
const apiRouter = require('./routers/apiRouter');
const mysqlDS = require('./lib/datastore/mysqlDS');
mysqlDS.init();


//--initialization------------------------------------------------------------------------------------------------------
var app = express();


//--view engine setup---------------------------------------------------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//--middleware: general-------------------------------------------------------------------------------------------------
app.use(httpLogger('dev', {immediate: false}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


//--routes: add own routers---------------------------------------------------------------------------------------------
app.use('/web', webAppRouter);
app.use('/api/v1/', apiRouter);


//--error handling: catch 404 and forward to error handler--------------------------------------------------------------
app.use(function (req, res, next) {
    next(createError(404));
});


//--error handling: prevent leaking stacktraces to user on production environment---------------------------------------
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
