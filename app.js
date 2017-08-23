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
var local = require('passport-local').Strategy;
var mongodb = require('mongodb');
var mongoose = require('mongoose');

// connect to database
mongoose.connect('mongodb://localhost/challenge',{
	useMongoClient: true
});
//var db = mongoose.connection;

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
app.use(validator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
			, root    = namespace.shift()
			, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));

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

// handle invalid routes
app.use(function(req, res, next) {
	res.status(400);
	res.render('error');
});

// set port and start server
var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Server listening on port %d', port);
});
