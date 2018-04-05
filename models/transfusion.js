const mongoose = require('mongoose');
const moment = require('moment');

var transfusionSchema = mongoose.Schema({
	volume: { required: true, type: Number},
	source: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
	bloodType: { required: true, type: Number, ref: 'BloodType' },
	draws: { 
		required: true, 
		type: [{
			draw: {type: mongoose.Schema.Types.ObjectId, ref: 'Draw'}, 
			transVolume: {type: Number},
			_id: false
		}]},
	recipient: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
	date: { required: true, type: Date},
	description: { type: String }
}, { versionKey: false });

transfusionSchema.post('aggregate', function(transfusions, next){
	transfusions.forEach(trans => {
		trans.date = moment(trans.date).format('DD.MM.YYYY HH:mm');
	});
	next();
});

transfusionSchema.post('find', function(transfusions, next){
	transfusions.forEach(trans => {
		trans.date = moment(trans.date).format('DD.MM.YYYY HH:mm');
	});
	next();
});

transfusionSchema.post('findOne', function(trans, next){
	trans.date = moment(trans.date).format('DD.MM.YYYY HH:mm');
	next();
});

var Transfusion = mongoose.model('Transfusion', transfusionSchema, 'Transfusion');

module.exports = Transfusion;