var mongoose = require('mongoose');
const moment = require('moment');

var transfusionSchema = mongoose.Schema({
	volume: { required: true, type: Number},
	source: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
	draw: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Draw'},
	recipient: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
	bloodType: { required: true, type: Number, ref: 'BloodType' },
	date: { required: true, type: Date},
	description: { type: String }
}, { versionKey: false });

transfusionSchema.post('aggregate', function(transfusions, next){
	transfusions.forEach(transfusion => {
		transfusion.date = moment(transfusion.date).locale('ru').format('DD.MM.YYYY HH:mm');
		transfusion.draw.date = moment(transfusion.draw.date).locale('ru').format('DD.MM.YYYY HH:mm');
	});
	next();
});

transfusionSchema.post('findOne', function(trans, next){
	trans.date = moment(trans.date).format('DD.MM.YYYY HH:mm');
	trans.draw.date = moment(trans.draw.date).format('DD.MM.YYYY HH:mm');
	next();
});

var Transfusion = mongoose.model('Transfusion', transfusionSchema, 'Transfusion');

module.exports = Transfusion;