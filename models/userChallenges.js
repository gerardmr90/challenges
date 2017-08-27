var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// UserDiplomas Schema
var UserChallengesSchema = mongoose.Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: true
	},
	challenges: [{
		type: Schema.ObjectId,
		ref: 'Challenge'
	}]
});

var UserChallenges = module.exports = mongoose.model('UserChallenges', UserChallengesSchema);

module.exports.createUserChallenges = function(newUserChallenges, callback) {
	newUserChallenges.save(callback);
};

module.exports.getUserChallengesById = function(id, callback) {
	UserChallenges.findById(id, callback);
};

module.exports.getUserChallengesByUserId = function(userId, callback) {
	var query = {user: userId};
	UserChallenges.findOne(query, callback);
};

module.exports.addChallengeToUserChallenges = function(userId, challenge, callback) {
	var query = {user: userId};
	var data = {$push: {challenges: challenge} };
	UserChallenges.update(query, data, callback);
};
