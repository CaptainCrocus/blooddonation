var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String
}, { versionKey: false });

var User = mongoose.model('User', userSchema, 'User');

module.exports = User;