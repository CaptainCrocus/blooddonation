var mongoose = require('mongoose');

var bloodDrawSchema = mongoose.Schema({
	_id: Number,
	typeName: String,
	slug: String
}, { versionKey: false });

var BloodDraw = mongoose.model('BloodDraw', bloodDrawSchema, 'BloodDraw');

module.exports = BloodDraw;