var mongoose = require('mongoose');

var personSchema = mongoose.Schema({
	firstName: { required: true, type: String},
	lastName: String,
	middleName: String,
    passport: String,
    fin: { required: true, type: String},
    address: String,
    phone: String,
    mobile: String,
    sex: { required: true, enum: ['male', 'female'], type: String},
    description: String,
    bloodType: { required: true, type: Number, ref: 'BloodType' },
    donor: Boolean,
    acceptor: Boolean
}, { versionKey: false });

var Person = mongoose.model('Person', personSchema, 'Person');

module.exports = Person;