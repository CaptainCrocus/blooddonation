var mongoose = require('mongoose');

var bloodSourceSchema = mongoose.Schema({
	sourceName: String,
	measure: String
}, { versionKey: false });

var BloodSource = mongoose.model('BloodSource', bloodSourceSchema, 'Source');

module.exports = BloodSource;