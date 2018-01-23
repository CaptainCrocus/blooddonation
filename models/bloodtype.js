var mongoose = require('mongoose');

var bloodTypeSchema = mongoose.Schema({
	_id: Number,
	typeName: String,
	slug: String,
}, { versionKey: false });

var BloodType = mongoose.model('BloodType', bloodTypeSchema, 'BloodType');

module.exports = BloodType;