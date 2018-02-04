var mongoose = require('mongoose');

var bloodDrawSchema = mongoose.Schema({
	volume: { required: true, type: Number},
	source: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'BloodSource' },
	person: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
	bloodType: { required: true, type: Number, ref: 'BloodType' },
	remainder: { required: true, type: Number},
	date: { required: true, type: Date},
}, { versionKey: false });

var BloodDraw = mongoose.model('BloodDraw', bloodDrawSchema, 'BloodDraw');

module.exports = BloodDraw;