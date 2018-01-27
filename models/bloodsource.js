var mongoose = require('mongoose');

var bloodSourceSchema = mongoose.Schema({
	_id: Number,
	sourceName: String
}, { versionKey: false });

var BloodSource = mongoose.model('BloodSource', bloodSourceSchema, 'Source');

module.exports = BloodSource;