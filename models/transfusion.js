var mongoose = require('mongoose');
const moment = require('moment');

var transfusionSchema = mongoose.Schema({
	volume: { required: true, type: Number},
	source: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
	draw: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Draw'},
	recipient: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
	bloodType: { required: true, type: Number, ref: 'BloodType' },
	date: { required: true, type: Date},
}, { versionKey: false });

transfusionSchema.post('aggregate', function(transfusions, next){
	transfusions.forEach(transfusion => {
		transfusion.date = moment(transfusion.date).locale('ru').format('DD.MM.YYYY');
	});
	next();
});
var Transfusion = mongoose.model('Transfusion', transfusionSchema, 'Transfusion');

module.exports = Transfusion;