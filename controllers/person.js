var express = require('express');
var router = express.Router();
var tools = require('../lib/tools');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var Person = require('../models/person');

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

// Fetch all persons
router.get('/person', (req, res) => {
	Person.find({}).populate('bloodType').exec(function(err, persons){
		if(err){
			console.log("/person|get - error: ", error);
			res.json({
				success: false,
				errors: [{message: 'Wrong query'}]
			});
		}
		else{			
			res.json({
				success: true,
				data: persons
			});
		}
	});
});

// Fetch single person
router.get('/person/:id', (req, res)=>{
	if(req.params.id === "undefined" || !req.params.id){
		return res.json({
			success: false,
			message: 'There is not the Person id'
		});
	}
	Person.findById(req.params.id, (err, person)=>{
		if(err){
			res.json({
				success: false,
				message: 'Wrong query'
			});
		}
		else{
			res.json({
				success: true,
				data: person
			});
		}
	})
});

// Add person
router.post('/person', 
	[
		check('firstName').exists().isLength({ min: 2 }),
		check('lastName').optional({ checkFalsy: true }),
		check('middleName').optional({ checkFalsy: true }),
		check('passport').optional({ checkFalsy: true }),
		check('fin').exists().isLength({ min: 7 }),
		check('address').optional({ checkFalsy: true }),
		check('phone').optional({ checkFalsy: true }),
		check('mobile').optional({ checkFalsy: true }),
		check('sex').exists(),
		check('bloodType').exists(),
		check('description').optional({ checkFalsy: true }),
	],
	(req, res)=>{
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
    		return res.status(422).json({ errors: errors.mapped() });
  		}
		var personInfo = matchedData(req);
		Person.create(personInfo, (err, person)=>{
			if(err){
				console.log(err);
				res.status(422).json({
					success: false,
					errors: [{message: 'Data Base Error'}]
				});
			}
			else{
				res.json({
					success: "true",
					data: person
				});
			}
		});
});

// Add person
router.put('/person/:id', 
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
		const errors = validationResult(req);
		var personInfo = matchedData(req);
		Person.updateOne({_id: req.params.id}, personInfo, (err, data)=>{
			if(err){
				console.log("/person|put - error: ", err);
				res.json({
					success: false,
					message: 'Wrong query'
				});
			}
			else{
				res.json({
					success: "true"
				});
			}
		});
});

module.exports = router;