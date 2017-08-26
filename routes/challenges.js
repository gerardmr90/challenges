var express = require('express');
var router = express.Router();
var Challenge = require('../models/challenge');
var Diploma = require('../models/diploma');
var Activity = require('../models/activity');
var UserActivities = require('../models/userActivities');
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

router.get('/:challengeName', auth.ensureAthentication, function(req, res) {
	res.render('challenges/' + req.originalUrl.split('/')[2] +'/preview');
});

router.get('/:challengeName/:activityName', auth.ensureAthentication, function(req, res) {
	UserActivities.getUserActivities(function(err, userActivities) {
		if (err) throw err;
		else {
			var progress = 0;

			if (userActivities.length > 0) {
				var currentUserActivities = userActivities.filter(obj => (obj.user.toString() == req.user._id.toString()));
				if (currentUserActivities.length === 0) {
					var new_userActivities = new UserActivities({
						user: req.user._id
					});

					UserActivities.createUserActivities(new_userActivities, function(err, userActitities) {
						if (err) throw err;
					});
				} else {
					progress = (currentUserActivities[0].activities.length + 0 / 5) * 100;
				}
			} else {
				var new_userActivities = new UserActivities({
					user: req.user._id
				});

				UserActivities.createUserActivities(new_userActivities, function(err, userActitities) {
					if (err) throw err;
				});
			}
		}
		res.render('challenges/' + req.originalUrl.split('/')[2] + '/' + req.originalUrl.split('/')[3], {
			progress: progress
		});
	});
});

// router.post('/hangman/lift', auth.ensureAthentication, function(req, res) {
// });
//

module.exports = router;
