var mongoose = require('mongoose');

var personSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	middleName: String,
    passport: String,
    fin: String,
    address: String,
    phone: String,
    mobile: String,
    sex: String,
    description: String,
    bloodType: { required: true, type: mongoose.Schema.Types.ObjectId, ref: 'BloodType' },
    donor: Boolean,
    acceptor: Boolean
}, { versionKey: false });

var Person = mongoose.model('Person', personSchema, 'Person');

module.exports = Person;