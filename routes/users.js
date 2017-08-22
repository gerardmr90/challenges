var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var auth = require('../middlewares/auth');

// GET register page.
router.get('/register', function(req, res) {
	res.render('users/register');
});

// GET login page.
router.get('/login', function(req, res) {
	res.render('users/login');
});

// POST on users page.
router.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var confirm_password = req.body.confirm_password;

	// Validation.
	req.checkBody('password', 'La contraeña debe tener como minimo 6 caracteres').len(6, 20);
	req.checkBody('confirm_password', 'La contraseña debe tener como mínimo 6 caracteres').len(6, 20);
	req.checkBody('password', 'Las contraseñas introducidas no coinciden').equals(req.body.confirm_password);

	req.getValidationResult().then(function(result) {
		if (result.isEmpty()) {
			User.getUserByUsername(username, function(err, user) {
				if (err) throw err;
				else if (user) {
					var errors = [{param: 'username', msg: 'El usuario ya existe', value: username}];
					res.render('users/register', {
						errors: errors
					});
				} else {
					var new_user = new User({
						username: username,
						password: password
					});

					User.createUser(new_user, function(err, user) {
						if (err) return err;
					});

					req.flash('success_msg', 'Registro completado');

					res.redirect('/users/login');
				}
			});
		} else {
			var errors = result.array();
			res.render('users/register', {
				errors: errors
			});
		}
	});
});

passport.use(new LocalStrategy (
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user) {
			if (err) throw err;
			if (!user){
				return done(null, false, {message: 'Usuario desconocido'});
			}

			User.comparePassword(password, user.password, function(err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, {message: 'Contraseña incorrecta'});
				}
			});
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

router.post('/login', passport.authenticate('local',{
	successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}), function(req, res) {
	res.redirect('/');
});

router.get('/logout', auth.ensureAthentication, function(req, res) {
	req.logout();
	req.flash('success_msg', 'Has cerrado la sesión');
	res.redirect('/users/login');
});

router.get('/:username', auth.ensureAthentication, function(req, res) {
	res.render('users/profile');
});

module.exports = router;
