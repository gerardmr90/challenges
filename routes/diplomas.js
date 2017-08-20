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
	var diplomaName = req.body.diplomaName;
	var description = req.body.description;

	Diploma.getDiplomaByName(diplomaName, function(err, diploma) {
		if (err) throw err;
		else if (diploma) {
			var errors = [{param: "diplomaName", msg: "El diploma ya existe", value: diplomaName}];
			res.render('register_diploma', {
				errors: errors
			});
		} else {
			var new_diploma = new Diploma({
				diplomaName: diplomaName,
				description: description
			});

			Diploma.createDiploma(new_diploma, function(err, diploma) {
				if (err) return err;
			});

			req.flash('success_msg', 'Diploma creado correctamente');

			res.redirect('/diplomas');
		}
	});
});

module.exports = router;
