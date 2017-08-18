var express = require('express');
var router = express.Router();
var User = require('../models/user')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

// GET register page
router.get('/register', function(req, res){
	res.render('register');
});

// GET login page
router.get('/login', function(req, res){
	res.render('login');
});

router.post('/register', function(req, res){
		var username = req.body.username;
		var password = req.body.password;
		var confirm_password = req.body.confirm_password;

	// Validation
	req.checkBody('username', 'Introduce un nombre de usuario').notEmpty();
	req.checkBody('password', 'Introduce una contraseña').notEmpty();
	req.checkBody('password', 'La contraeña debe tener como minimo 6 caracteres').len(6, 20);
	req.checkBody('confirm_password', 'Vuelve a introducir la contraseña').notEmpty();
	req.checkBody('confirm_password', 'La contraeña debe tener como minimo 6 caracteres').len(6, 20);
	req.checkBody('password', 'La contraseña introducida no coincide').equals(req.body.confirm_password);

	req.getValidationResult().then(function(result) {
		if (result.isEmpty()) {
			var new_user = new User({
				username: username,
				password: password
			});

			User.createUser(new_user, function(err, user){
				if (err) return err;
				console.log(user);
			});

			req.flash('success_msg', 'Registro completado');

			res.redirect('/users/login');
		} else {
			var errors = result.array();
			res.render('register', {
				errors: errors
			});
		}
	});
});

passport.use(new LocalStrategy (
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user){
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
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', passport.authenticate('local',
	{successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
		function(req, res) {
			res.redirect('/');
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'Has cerrado la sesion');
	res.redirect('/users/logout');
});

module.exports = router;
