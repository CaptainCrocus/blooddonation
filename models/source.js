var mongoose = require('mongoose');

var sourceSchema = mongoose.Schema({
	sourceName: String,
	measure: String
}, { versionKey: false });

var Source = mongoose.model('Source', sourceSchema, 'Source');

module.exports = Source;