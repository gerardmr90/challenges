var express = require('express');
var router = express.Router();
var Challenge = require('../models/challenge');
var Diploma = require('../models/diploma');
var Activity = require('../models/activity');
var UserActivities = require('../models/userActivities');
var UserChallenges = require('../models/userChallenges');
var UserDiplomas = require('../models/userDiplomas');
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

router.get('/:challengeName', auth.ensureAthentication, function(req, res, next) {
	Challenge.getChallengeByName(req.params.challengeName, function(err, challenge) {
		if (err) throw err;
		else {
			if (challenge) {
				res.render('challenges/' + req.params.challengeName +'/preview');
			} else {
				next(err)
			}
		}
	});
});

router.post('/:challengeName', auth.ensureAthentication, function(req, res) {
	var userId = req.body.userId;

	UserActivities.getUserActivitiesByUserId(userId, function(err, userActivities) {
		if (err) throw err;
		else {
			Challenge.getChallengeByName(req.params.challengeName, function(err, challenge) {
				if (err) throw err;
				else {
					var totalActivities = challenge.activities.length;
					if (userActivities.activities.length === totalActivities) {

						UserDiplomas.addDiplomaToUserDiplomas(userId, challenge.diploma, function(err, userDiplomas) {
							if (err) throw err;
						});
						UserChallenges.addChallengeToUserChallenges(userId, challenge._id, function(err, userDiplomas) {
							if (err) throw err;
						});
					}
				}
			});
		}
	});
});

router.get('/:challengeName/:activityName', auth.ensureAthentication, function(req, res, next) {
	UserActivities.getUserActivities(function(err, userActivities) {
		if (err) throw err;
		else {
			var progress = 0;
			var currentUserActivities = userActivities.filter(obj => (obj.user.toString() === req.user._id.toString()));

			Challenge.getChallengeByName(req.params.challengeName, function(err, challenge) {
				if (err) throw err;
				else {
					if (challenge) {
						var totalActivities = challenge.activities.length;
						progress = (currentUserActivities[0].activities.length / totalActivities) * 100;
					}
				}
			});
		}

		var activityName = req.params.activityName;
		var challengeName = req.params.challengeName;
		var array = currentUserActivities[0].activities;

		Activity.getActivityByName(activityName, function(err, activity) {
			if (err) throw err;
			else {
				if (activity) {
					var completed = array.filter(obj => obj.toString() === activity._id.toString());					
					res.render('challenges/' + challengeName + '/' + activityName, {
						progress: progress,
						userId: req.user._id,
						activityId: activity._id,
						completed: completed
					});
				} else {
					next(err);
				}
			}
		});
	});
});

router.post('/:challengeName/:activityName', auth.ensureAthentication, function(req, res) {
	var userId = req.body.userId;
	var activityId = req.body.activityId;

	UserActivities.getUserActivitiesByUserId(userId, function(err, userActivities) {
		if (err) throw err;
		else {
			var activityCompleted = userActivities.activities.filter(obj => (obj.toString() === activityId));
			if (activityCompleted.length === 0) {
				Activity.getActivityById(activityId, function (err, activity) {
					if (err) throw err;
					else {
						UserActivities.addActivityToUserActivities(userId, activity, function(err, result){
							if (err) throw err;
						});
					}
				});
			}
		}
	});
});

module.exports = router;
