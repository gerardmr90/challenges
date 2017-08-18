var express = require('express');
var router = express.Router();
var User = require('../models/user')

// GET register page
router.get('/register', function(req, res){
	res.render('register');
});

// GET login page
router.get('/login', function(req, res){
	res.render('login');
});

// POST register page
// router.post('/register', function(req, res){
// 	var user_name = req.body.user_name;
// 	var password = req.body.password;
// 	var confirm_password = req.body.confirm_password;
//
// 	req.checkBody('user_name', 'Introduce un nombre de usuario').notEmpty();
// 	req.checkBody('password', 'Introduce una contraseña').notEmpty();
// 	req.checkBody('confirm_password', 'Vuelve a introducir la contraseña').notEmpty();
// 	req.checkBody('password', 'La contraseña introducida no coincide').equals(req.body.confirm_password);
//
// 	req.getValidationResult().then(function(result) {
// 		var errors = result.array();
//   	res.render('register', {
// 			errors: errors
// 		});
// 	});
//
// 	var new_user = new User({
// 		user_name: user_name,
// 		password: password
// 	});
//
// 	User.createUser(new_user, function(err, user){
// 		if (err) return err;
// 		console.log(user);
// 	});
//
// 	req.flash('success_msg', 'Registro completado');
//
// 	res.redirect('/users/login');
// });

router.post('/register', function(req, res){
		var user_name = req.body.user_name;
		var password = req.body.password;
		var confirm_password = req.body.confirm_password;

	// Validation
	req.checkBody('user_name', 'Introduce un nombre de usuario').notEmpty();
	req.checkBody('password', 'Introduce una contraseña').notEmpty();
	req.checkBody('password', 'La contraeña debe tener como minimo 6 caracteres').len(6, 20);
	req.checkBody('confirm_password', 'Vuelve a introducir la contraseña').notEmpty();
	req.checkBody('confirm_password', 'La contraeña debe tener como minimo 6 caracteres').len(6, 20);
	req.checkBody('password', 'La contraseña introducida no coincide').equals(req.body.confirm_password);

	req.getValidationResult().then(function(result) {
		if (result.isEmpty()) {
			var new_user = new User({
				user_name: user_name,
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

	// var errors = req.validationErrors();
	//
	// if(errors){
	// 	res.render('register',{
	// 		errors:errors
	// 	});
	// } else {
	// 	var newUser = new User({
	// 		user_name: user_name,
	// 		password: password
	// 	});
	//
	// 	User.createUser(newUser, function(err, user){
	// 		if(err) throw err;
	// 		console.log(user);
	// 	});
	//
	// 	req.flash('success_msg', 'You are registered and can now login');
	//
	// 	res.redirect('/users/login');
	// }
// });

module.exports = router;
