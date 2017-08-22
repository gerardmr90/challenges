var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Challenge Schema
var ChallengeSchema = mongoose.Schema({
	challengeName: {
		type: String,
		index:true
	},
	diploma: {
		type: Schema.ObjectId,
		ref: 'Diploma',
		required: true
	},
	activities: [{
		type: Schema.ObjectId,
		ref: 'Activity',
		required: true
	}],
	description: {
		type: String
	}
});

ChallengeSchema.virtual('url').get(function () {
	return '/challenges/' + this.challengeName;
});

var Challenge = module.exports = mongoose.model('Challenge', ChallengeSchema);

module.exports.createChallenge = function(newChallenge, callback) {
	newChallenge.save(callback);
};

module.exports.getChallengeByName = function(challengeName, callback) {
	var query = {challengeName: challengeName};
	Challenge.findOne(query, callback);
};

module.exports.getChallengeById = function(id, callback) {
	Challenge.findById(id, callback);
};

module.exports.getChallenges = function(callback) {
	Challenge.find(callback);
};
