const express = require('express');
const router = express.Router();
const moment = require('moment');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var Draw = require('../models/draw');
var Person = require('../models/person');

// Fetch all draws
router.get('/draw', (req, res) => {
	Draw.aggregate([
		{$match: {}},
		{
			$project: {
				volume: 1,
				remainder: 1,
				date: 1,
				source: 1,
				person: 1,
				bloodType: 1
			}
		}
	])
	.lookup({ from: 'Source', localField: 'source', foreignField: '_id', as: 'source' })
	.lookup({ from: 'Person', localField: 'person', foreignField: '_id', as: 'person' })
	.lookup({ from: 'BloodType', localField: 'bloodType', foreignField: '_id', as: 'bloodType' })
	.unwind('source', 'person', 'bloodType')
	.exec((err, draws) => {
		if(err){
			console.log("/person|get - error: ", err);
			res.json({
				success: false,
				message: 'Wrong query'
			});
		}
		else{
			res.json({
				success: true,
				data: draws
			});
		}
	});
});

// Fetch single draw
router.get('/draw/:id', (req, res)=>{
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
router.post('/draw', 
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
		  					person.save((err, person)=>{
		  						res.set('Location', 'http://localhost:8080/draw/show/' +draw._id);
								res.json({
									success: "true",
									data: draw
								});		  						
		  					});
				 		}
				 	}
				});
			}
		});
});

// Edit draw
// TODO:
router.put('/draw/:id', 
	(req, res)=>{
	res.json({
		success: "false",
		message: "Not realized!"
	});
});

module.exports = router;