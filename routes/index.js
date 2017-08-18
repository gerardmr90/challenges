var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAthentication, function(req, res) {
	res.render('index');
});

function ensureAthentication(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;
