var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// UserDiplomas Schema
var UserDiplomasSchema = mongoose.Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: true
	},
	diplomas: [{
		type: Schema.ObjectId,
		ref: 'Diploma'
	}]
});

var UserDiplomas = module.exports = mongoose.model('UserDiplomas', UserDiplomasSchema);

module.exports.createUserDiplomas = function(newUserDiplomas, callback) {
	newUserDiplomas.save(callback);
};

module.exports.getUserDiplomasById = function(id, callback) {
	UserDiplomas.findById(id, callback);
};

module.exports.getUserDiplomasByUserId = function(userId, callback) {
	var query = {user: userId};
	UserDiplomas.findOne(query, callback);
};

module.exports.addDiplomaToUserDiplomas = function(userId, diploma, callback) {
	var query = {user: userId};
	var data = {$push: {diplomas: diploma} };
	UserDiplomas.update(query, data, callback);
};
