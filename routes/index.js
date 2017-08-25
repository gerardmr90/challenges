var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var Challenge = require('../models/challenge');

/* GET home page. */
router.get('/', auth.ensureAthentication, function(req, res) {
	Challenge.getChallenges(function(err, challenges) {
		if (err) throw err;
		else {
			res.render('index', {
				challenges: challenges});
		}
	});
});

module.exports = router;
