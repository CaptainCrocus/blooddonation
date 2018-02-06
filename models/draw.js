var mongoose = require('mongoose');
const moment = require('moment');

var drawSchema = mongoose.Schema({
	volume: { required: true, type: Number},
	source: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
	person: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
	bloodType: { required: true, type: Number, ref: 'BloodType' },
	remainder: { required: true, type: Number},
	date: { required: true, type: Date},
}, { versionKey: false });

drawSchema.post('aggregate', function(draws, next){
	draws.forEach(draw => {
		draw.date = moment(draw.date).locale('ru').format('DD.MM.YYYY');
	});
	next();
});

drawSchema.post('findOne', function(draw, next){
	draw.date = moment(draw.date).locale('ru').format('DD.MM.YYYY');
	next();
});

var Draw = mongoose.model('Draw', drawSchema, 'Draw');

module.exports = Draw;