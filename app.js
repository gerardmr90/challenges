var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var validator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var mongoose = require('mongoose');

// connect to database
mongoose.connect('mongodb://localhost/challenge',{
	useMongoClient: true
});

// set routes
var index = require('./routes/index');
var users = require('./routes/users');
var challenges = require('./routes/challenges');
var diplomas = require('./routes/diplomas');
var activities = require('./routes/activities');

// initialize app
var app = express();

// set logger
app.use(logger('dev'));

// set view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// set bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// set favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// set express session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

//set express validator
app.use(validator({errorFormatter: function(param, msg, value) {
	var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

	while(namespace.length) {
		formParam += '[' + namespace.shift() + ']';
	}
	return {
		param : formParam,
		msg : msg,
		value : value
	};
}}));

// set connect flash
app.use(flash());

// set global variables
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// set routes
app.use('/', index);
app.use('/users', users);
app.use('/challenges', challenges);
app.use('/diplomas', diplomas);
app.use('/activities', activities);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
