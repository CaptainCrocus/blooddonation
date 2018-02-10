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
    recipient: Boolean
}, { versionKey: false });

/*personSchema.index({
    firstName: 'text', 
    lastName: 'text'
});
*/

var Person = mongoose.model('Person', personSchema, 'Person');

module.exports = Person;