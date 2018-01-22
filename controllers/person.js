var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var Person = require('../models/person');

router.post('/add', 
	[
		check('firstName').exists(),
		check('lastName').exists(),
		check('middleName').optional({ checkFalsy: true }),
		check('passport').optional({ checkFalsy: true }),
		check('fin').exists(),
		check('address').optional({ checkFalsy: true }),
		check('phone').optional({ checkFalsy: true }),
		check('mobile').optional({ checkFalsy: true }),
		check('sex').exists(),
		check('bloodType').exists(),
		check('description').optional({ checkFalsy: true }),
	],
	(req, res)=>{
	const errors = validationResult(req)
	var personInfo = matchedData(req);
	console.log(personInfo);
	Person.create(personInfo, (err, person)=>{
		console.log(person);
	});
/*	new Person({
		firstName: "Mamed",
		lastName: "Mamedov",
		middleName: "Mamedovich",
		passport: "AZ10223253355",
		fin: "F548JU943",
		address: "55, Heydar Alyev str.",
		phone: "+994122583654",
		mobile: "+994553652147",
		sex: true,
		description: "Some text about Mamed Mamedov",
		donor: false,
		acceptor: false
	}).save();
*/
	res.redirect('/');
});

router.get('/list', (req, res) => {
	console.log("Person List");
	Person.find({}, function(err, docs){
		if(err)
			res.json({
				success: false,
				message: 'Wrong query'
			});
		else
			res.json({
				success: "true",
				data: docs
			});
	});
});

module.exports = router;