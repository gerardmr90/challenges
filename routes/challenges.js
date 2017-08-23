var express = require('express');
var router = express.Router();
var Challenge = require('../models/challenge');
var Diploma = require('../models/diploma');
var Activity = require('../models/activity');
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', auth.ensureAthentication, function(req, res) {
	Challenge.getChallenges(function(err, challenges) {
		if (err) throw err;
		else {
			res.render('challenges/challenges', {
				challenges: challenges});
		}
	});
});

// GET register page.
router.get('/register', auth.ensureAthentication, function(req, res) {
	Diploma.getDiplomas(function(err, diplomas) {
		if (err) throw err;
		Activity.getActivities(function(err, activities) {
			if (err) throw err;
			res.render('challenges/register', {
				diplomas: diplomas,
				activities: activities
			});
		});
	});
});

// POST on challenges page.
router.post('/register', auth.ensureAthentication, function(req, res) {
	var challengeName = req.body.challengeName;
	var diploma = req.body.diploma;
	var activities = req.body.activities;
	var description = req.body.description;

	Challenge.getChallengeByName(challengeName, function(err, challenge) {
		if (err) throw err;
		else if (challenge) {
			var errors = [{param: 'challengeName', msg: 'El reto ya existe', value: challengeName}];
			res.render('challenges/register', {
				errors: errors
			});
		} else {
			var new_challenge = new Challenge({
				challengeName: challengeName,
				diploma: diploma,
				activities: activities,
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

router.get('/ahorcado', auth.ensureAthentication, function(req, res) {
	res.render('challenges/ahorcado/preview');
});

router.get('/ahorcado/1', auth.ensureAthentication, function(req, res) {
	res.render('challenges/ahorcado/game');
});

router.get('/ahorcado/2', auth.ensureAthentication, function(req, res) {
	res.render('challenges/ahorcado/game');
});

router.get('/ahorcado/3', auth.ensureAthentication, function(req, res) {
	res.render('challenges/ahorcado/game');
});

router.get('/ahorcado/4', auth.ensureAthentication, function(req, res) {
	res.render('challenges/ahorcado/game');
});

router.get('/ahorcado/5', auth.ensureAthentication, function(req, res) {
	res.render('challenges/ahorcado/game');
});

module.exports = router;
