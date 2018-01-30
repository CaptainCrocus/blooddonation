var mongoose = require('mongoose');

var bloodDrawSchema = mongoose.Schema({
	volume: Number,
	source_id: { required: true, type: mongoose.Schema.Types.ObjectId },
	person_id: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
	bloodType_id: { required: true, type: Number },
	date: Date
}, { versionKey: false });

var BloodDraw = mongoose.model('BloodDraw', bloodDrawSchema, 'BloodDraw');

module.exports = BloodDraw;