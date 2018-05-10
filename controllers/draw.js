const express = require('express');
const router = express.Router();
const moment = require('moment');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var Draw = require('../models/draw');
var Person = require('../models/person');

module.exports = function(){
	// Fetch all draws
	router.get('/', async (req, res) => {
		let limit = parseInt(req.query.pageSize);
		limit = (limit !== NaN && Number.isInteger(limit)) ? limit : 10;

		const findObj = {
			$and: [
			]
		};

		let date = req.query.date !== undefined ? req.query.date : null;

		if(moment(date).isValid()){
			const start = moment(date).format();
			const end = moment(date).add(1, 'd').format();
			findObj.$and.push({date: {$gte: start, $lt: end}});
		}

		let bloodType = parseInt(req.query.bloodType);
		bloodType = (bloodType !== NaN && Number.isInteger(bloodType)) ? bloodType : null;

		if(bloodType !== null){
			findObj.$and.push({bloodType: bloodType});
		}
		
		let source = (req.query.source !== undefined) ? req.query.source : null;

		if(source !== null){
			findObj.$and.push({source: source});
		}

		if(req.query.personId != null){
			findObj.$and.push({person: req.query.personId});
		}

		let offset = parseInt(req.query.offset);
		offset = (offset !== NaN) ? offset : 0; 

		let sortObj = {};
		let sortFromReq = JSON.parse(req.query.sortObj);
		if(sortFromReq){
			if(undefined !== sortFromReq.date && sortFromReq.date !== null)
				sortObj.date = (sortFromReq.date) ? -1 : 1;
		}

		try{
			if(undefined !== req.query.person && req.query.person !== ''){
				const person = new RegExp(req.query.person, 'i');
				const persons = await Person.find({ 
					$or: [{firstName: person}, {lastName: person}] 
				})
				.lean();

				persons_ids = persons.map(function(person) {
  					return person._id
				});

				findObj.$and.push({person: {$in: persons_ids}});
			}

			const response = await Draw.find(findObj.$and.length ? findObj : {})
				.sort(sortObj)
				.skip(offset)
				.limit(limit)
				.populate('source')
				.populate('bloodType')
				.populate('person')
				.lean();
			
			const count = await Draw.count(findObj.$and.length ? findObj : {});

			res.json({
				success: true,
				data: response,
				totalCount: count,
				pageSize: limit,
				offset: offset
			});
		} catch(error) {
			console.log("/draw|get - error: ", error);
			res.json({
				success: false,
				errors: [{message: 'Wrong query'}]
			});
		}
	});

	// Fetch single draw
	router.get('/:id', (req, res)=>{
		if(req.params.id === "undefined" || !req.params.id){
			return res.json({
				success: false,
				message: 'There is not the Draw id'
			});
		}
		Draw.findOne({_id: req.params.id})
		.populate('bloodType')
		.populate('person')
		.populate('source')
		.lean()
		.exec(function(err, draw){
			if(err){
				res.json({
					success: false,
					message: 'Wrong query'
				});
			}
			else{
				res.json({
					success: true,
					data: draw
				});
			}
		})
	});

	// Add draw
	router.post('/', 
		[
			check('volume').exists(),
			check('source').exists(),
			check('person').exists(),
			check('bloodType').exists(),
			check('description').optional({ checkFalsy: true }),
			check('date').exists()
		],
		(req, res)=>{
			const errors = validationResult(req)
			var drawInfo = matchedData(req);

			// TODO: использовать валидаторы схемы
			drawInfo.date = moment(drawInfo.date, "DD.MM.YYYY HH:mm");
			
			drawInfo.remainder = drawInfo.volume;
			var draw = new Draw(drawInfo);
			draw.save(drawInfo, (err, draw)=>{
				if(err){
					console.log("/draw|post - error: ", err);
					res.json({
						success: false,
						message: 'Wrong query'
					});
				}
				else{
					Person.findById(draw.person, (err, person)=>{
					 	if (err){
					 		console.log("/draw|post - error: ", err);
					 	}
					 	else{
					 		if(!person.donor){		 			
			  					person.donor = true;
								person.save();
					 		}
					 	}
					});
					res.json({
						success: "true",
						data: draw
					});		  						
				}
			});
	});

	// Edit draw
	// TODO:
	router.put('/:id', 
		(req, res)=>{
		res.json({
			success: "false",
			message: "Not realized!"
		});
	});

	return router;
};
