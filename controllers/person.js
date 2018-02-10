const express = require('express');
const router = express.Router();
const tools = require('../lib/tools');
const util = require('util');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var Person = require('../models/person');

// Fetch all persons
router.get('/person', async (req, res) => {

	let limit = parseInt(req.query.pageSize);
	limit = (limit !== NaN && Number.isInteger(limit)) ? limit : 10;

	const name = new RegExp(req.query.name, 'i');
	const fin = new RegExp(req.query.fin, 'i');

	let bloodType = parseInt(req.query.bloodType);
	bloodType = (bloodType !== NaN && Number.isInteger(bloodType)) ? bloodType : '';

	let offset = parseInt(req.query.offset);
	offset = (offset !== NaN) ? offset : 0; 

	const findObj = {
		$and: [
			{ fin: fin},
			{ $or: [{firstName: name}, {lastName: name}] }
		]
	};
	if(bloodType !== ''){
		findObj.$and.push({bloodType: bloodType});
	}

	try{
		const response = await Person.find(findObj)
		.skip(offset)
		.limit(limit).populate('bloodType')
		.sort({bloodType: 1, firstName: 1});
		
		const count = await Person.count(findObj);

		res.json({
			success: true,
			data: response,
			totalCount: count,
			pageSize: limit,
			offset: offset
		});
	} catch(error) {
		console.log("/person|get - error: ", error);
		res.json({
			success: false,
			errors: [{message: 'Wrong query'}]
		});
	}
});

// Fetch single person
router.get('/person/:id', (req, res)=>{
	if(req.params.id === "undefined" || !req.params.id){
		return res.json({
			success: false,
			message: 'There is not the Person id'
		});
	}
	Person.findById(req.params.id).populate('bloodType').exec(function(err, person){
		console.log(person);
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
		check('lastName').optional({ checkFalsy: true }).isLength({ min: 2 }),
		check('middleName').optional({ checkFalsy: true }),
		check('passport').optional({ checkFalsy: true }),
		check('fin').exists().isLength({ min: 7, max: 7 }),
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