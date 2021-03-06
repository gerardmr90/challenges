var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// UserActivities Schema
var UserActivitiesSchema = mongoose.Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: true
	},
	activities: [{
		type: Schema.ObjectId,
		ref: 'Activity'
	}]
});

var UserActivities = module.exports = mongoose.model('UserActivities', UserActivitiesSchema);

module.exports.createUserActivities = function(newUserActivities, callback) {
	newUserActivities.save(callback);
};

module.exports.getUserActivitiesById = function(id, callback) {
	UserActivities.findById(id, callback);
};

module.exports.getUserActivitiesByUserId = function(userId, callback) {
	var query = {user: userId};
	UserActivities.findOne(query, callback);
};

module.exports.addActivityToUserActivities = function(userId, activity, callback) {
	var query = {user: userId};
	var data = {$push: {activities: activity} };
	UserActivities.update(query, data, callback);
};

module.exports.getUserActivities = function(callback) {
	UserActivities.find(callback);
};
