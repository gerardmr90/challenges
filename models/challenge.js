var mongoose = require('mongoose');

// Challenge Schema
var ChallengeSchema = mongoose.Schema({
	challengeName: {
		type: String,
		index:true
	},
	diplomaName: {
		type: String
	},
	description: {
		type: String
	}
});

var Challenge = module.exports = mongoose.model('Challenge', ChallengeSchema);

module.exports.createChallenge = function(newChallenge, callback) {
	newChallenge.save(callback);
}

module.exports.getChallengeByName = function(challengeName, callback) {
	var query = {challengeName: challengeName};
	Challenge.findOne(query, callback);
}

module.exports.getChallengeById = function(id, callback) {
	Challenge.findById(id, callback);
}
