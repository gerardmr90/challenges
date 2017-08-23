var mongoose = require('mongoose');

// Activity Schema
var ActivitySchema = mongoose.Schema({
	activityName: {
		type: String,
		index:true
	},
	description: {
		type: String
	}
});

var Activity = module.exports = mongoose.model('Activity', ActivitySchema);

module.exports.createActivity = function(newActivity, callback) {
	newActivity.save(callback);
};

module.exports.getActivityByName = function(activityName, callback) {
	var query = {activityName: activityName};
	Activity.findOne(query, callback);
};

module.exports.getActivityById = function(id, callback) {
	Activity.findById(id, callback);
};

module.exports.getActivities = function(callback) {
	Activity.find(callback);
};
