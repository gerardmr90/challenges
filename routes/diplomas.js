var express = require('express');
var router = express.Router();
var Diploma = require('../models/diploma');
var auth = require('../middlewares/auth');

// GET home page.
router.get('/', auth.ensureAthentication, function(req, res) {
	res.render('diplomas');
});

// GET register page.
router.get('/register', auth.ensureAthentication,function(req, res) {
	res.render('register_diploma');
});

// POST on diplomas page.
router.post('/register', function(req, res) {
		var name = req.body.name;
		var description = req.body.description;

	// Validation.
	req.checkBody('diploma_name', 'Introduce un nombre para el diploma').notEmpty();
	req.checkBody('description', 'Introduce una descripción para el diploma').notEmpty();


	req.getValidationResult().then(function(result) {
		if (result.isEmpty()) {
			var new_diploma = new Diploma({
				name: name,
				description: description
			});

			Diploma.createDiploma(new_diploma, function(err, diploma) {
				if (err) return err;
				console.log(diploma);
			});

			req.flash('success_msg', 'Diploma creado correctamente');

			res.redirect('/diplomas');
		} else {
			var errors = result.array();
			res.render('register_diploma', {
				errors: errors
			});
		}
	});
});

module.exports = router;
