var express = require('express');
var router = express.Router();
var Activity = require('../models/activity');
var auth = require('../middlewares/auth');

// GET home page.
router.get('/', auth.ensureAthentication, function(req, res) {
	Activity.getActivities(function(err, activities) {
		if (err) throw err;
		else {
			res.render('activities/activities', {
				activities: activities});
		}
	});
});

// GET register page.
router.get('/register', auth.ensureAthentication, function(req, res) {
	res.render('activities/register');
});

// POST on diplomas page.
router.post('/register', auth.ensureAthentication, function(req, res) {
	var activityName = req.body.activityName;
	var description = req.body.description;

	Activity.getActivityByName(activityName, function(err, activity) {
		if (err) throw err;
		else if (activity) {
			var errors = [{param: 'activityName', msg: 'La actividad ya existe', value: activityName}];
			res.render('activities/register', {
				errors: errors
			});
		} else {
			var new_activity = new Activity({
				activityName: activityName,
				description: description
			});

			Activity.createActivity(new_activity, function(err, activity) {
				if (err) return err;
			});

			req.flash('success_msg', 'Actividad creada correctamente');

			res.redirect('/activities');
		}
	});
});

module.exports = router;
