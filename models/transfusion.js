var mongoose = require('mongoose');
const moment = require('moment');

var transfusionSchema = mongoose.Schema({
	volume: { required: true, type: Number},
	source: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
	draws: { required: true, type: [mongoose.Schema.Types.ObjectId], ref: 'Draw'},
	recipient: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
	// bloodType: { required: true, type: Number, ref: 'BloodType' },
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
	console.log(trans);
	trans.date = moment(trans.date).format('DD.MM.YYYY HH:mm');
	for(let draw in trans.draws){
		console.log(draw);
		draw.date = moment(draw.date).format('DD.MM.YYYY HH:mm');
	}
	next();
});

var Transfusion = mongoose.model('Transfusion', transfusionSchema, 'Transfusion');

module.exports = Transfusion;