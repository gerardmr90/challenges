var express = require('express');
var router = express.Router();
var Challenge = require('../models/challenge');
var Diploma = require('../models/diploma');
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', auth.ensureAthentication, function(req, res) {
	res.render('challenges/challenges');
});

// GET register page.
router.get('/register', auth.ensureAthentication, function(req, res) {
	Diploma.getDiplomas(function(err, diplomas) {
		if (err) throw err;
		else if (diplomas) {
			res.render('challenges/register', {
				diplomas: diplomas
			});
			console.log(diplomas);
		} else {
			res.render('challenges/register');
		}
	});
});

// POST on challenges page.
router.post('/register', auth.ensureAthentication, function(req, res) {
	var challengeName = req.body.challengeName;
	var diplomaName = req.body.diplomaName;
	var description = req.body.description;

	Challenge.getChallengeByName(challengeName, function(err, challenge) {
		if (err) throw err;
		else if (challenge) {
			var errors = [{param: "challengeName", msg: "El reto ya existe", value: challengeName}];
			res.render('challenges/register', {
				errors: errors
			});
			console.log(errors);
		} else {
			var new_challenge = new Challenge({
				challengeName: challengeName,
				diplomaName: diplomaName,
				description: description
			});

			Challenge.createChallenge(new_challenge, function(err, challenge) {
				if (err) return err;
			});

			req.flash('success_msg', 'Reto creado correctamente');

			res.redirect('/challenges');
		}
	});
});

module.exports = router;
