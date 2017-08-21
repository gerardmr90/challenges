var mongoose = require('mongoose');

// Diploma Schema
var DiplomaSchema = mongoose.Schema({
	diplomaName: {
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

module.exports.getDiplomaByName = function(diplomaName, callback) {
	var query = {diplomaName: diplomaName};
	Diploma.findOne(query, callback);
}

module.exports.getDiplomaById = function(id, callback) {
	Diploma.findById(id, callback);
}

module.exports.getDiplomas = function(callback) {
	Diploma.find(callback);
}
