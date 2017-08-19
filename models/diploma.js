var mongoose = require('mongoose');

// Diploma Schema
var DiplomaSchema = mongoose.Schema({
	name: {
		type: String,
		index:true
	},
	description: {
		type: String
	}
});

var Diploma = module.exports = mongoose.model('Diploma', DiplomaSchema);

module.exports.createDiploma = function(diploma, callback) {
	diploma.save(callback);
}

module.exports.getDiplomaByName = function(name, callback) {
	var query = {name: name};
	Diploma.findOne(query, callback);
}

module.exports.getDiplomaById = function(id, callback) {
	Diploma.findById(id, callback);
}
