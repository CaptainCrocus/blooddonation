const express = require('express');
const router = express.Router();
const moment = require('moment');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var Transfusion = require('../models/transfusion');
var Draw = require('../models/draw');
var Person = require('../models/person');

module.exports = function(){
	// Fetch all transfusions
	router.get('/', (req, res) => {
		Transfusion.find({})
		.populate('bloodType')
		.populate('source')
		.populate({ path: 'draws', model: 'Draw', populate: { path: 'person', model: 'Person'}})
		.populate('recipient')
		.lean()

// 		Transfusion.aggregate([
// 			{$match: {}},
// 			{
// 				$project: {
// 					volume: 1,
// 					date: 1,
// 					source: 1,
// 					draws: 1,
// 					recipient: 1,
// 					description: 1
// 				}
// 			},
// 			{ $lookup: { from: 'Person', localField: 'recipient', foreignField: '_id', as: 'recipient' }},
// 			{ $unwind: '$recipient'},
// 			// { 
// 			// 	$lookup: { 
// 			// 		from: 'BloodType', 
// 			// 		localField: 'recipient.bloodType', 
// 			// 		foreignField: '_id', 
// 			// 		as: 'recipient.bloodType' 
// 			// 	}
// 			// },
// 			// { $unwind: '$recipient.bloodType'},
// 			{ $unwind: '$draws'},
// 			{ $lookup: { from: 'Draw', localField: 'draws', foreignField: '_id', as: 'draws' }},
// 			{ $unwind: '$draws'},
// 			{ $group: {
// 				_id: '$_id',
// 				draws: { $push: '$draws'},
// 				recipient: { $addToSet: '$recipient'},
// 				date: { $addToSet: '$date'}
// 			}},
// 			{$unwind: '$recipient'}
// //			{ $lookup: { from: 'Person', localField: 'draw.person', foreignField: '_id', as: 'draw.person' }},
// //			{ $unwind: '$draw.person'},
// 		])
// 		.lookup({ from: 'Source', localField: 'source', foreignField: '_id', as: 'source' })
// //		.lookup({ from: 'BloodType', localField: 'bloodType', foreignField: '_id', as: 'bloodType' })
// //		.unwind('source'/*, 'bloodType'*/)

		.exec((err, trans) => {
			console.log(trans);
			if(err){
				console.log("/person|get - error: ", err);
				res.json({
					success: false,
					errors: [{type: err.type, message: err.message}]
				});
			}
			else{
				res.json({
					success: true,
					data: trans
				});
			}
		});
	});

	// Fetch single transfusion
	router.get('/:id', (req, res)=>{
		if(req.params.id === "undefined" || !req.params.id){
			return res.json({
				success: false,
				message: 'There is not the Trans id'
			});
		}
		Transfusion.findOne({_id: req.params.id})
		.populate('bloodType')
		.populate('source')
		.populate({ path: 'draws', model: 'Draw', populate: { path: 'person', model: 'Person'}})
		.populate('recipient')
		.lean()
		.exec(function(err, trans){
			if(err){
				res.json({
					success: false,
					message: 'Wrong query'
				});
			}
			else{
				res.json({
					success: true,
					data: trans
				});
			}
		})
	});

	// Add transfusion
	router.post('/', 
		[
			check('source').exists(),
			check('draws').exists(),
			check('recipient').exists(),
			check('description').optional({ checkFalsy: true }),
			check('date').exists()
		], async (req, res)=>{
		
		try{
			const errors = validationResult(req)
			var transInfo = matchedData(req);
			transInfo.volume = transInfo.draws.reduce((sum, draw)=>{
				return sum + parseInt(draw.transVolume);
			}, 0);

			console.log(transInfo.volume);
			
			if (!errors.isEmpty()) {
	    		return res.status(422).json({ errors: errors.mapped() });
	  		}

			transInfo.date = moment(transInfo.date, "DD.MM.YYYY HH:mm");
			
			let draws = await Draw.find({_id: {
				$in: transInfo.draws.map(function(draw) {
  					return draw._id;
				})
			}});

			if(draws.length != transInfo.draws.length){
				throw Error("There aren't some draws in the DataBase");
			}

			console.log(draws);

			let trans = new Transfusion(transInfo);
			let createdTrans = await trans.save();

			await Promise.all(transInfo.draws.map(async (draw)=>{
				let drawRes = await Draw.findOne({_id: draw});
				// if(transInfo.volume > draw.remainder){
				// 	throw new RangeError('The transfusion volume is greater than draw volume');
				// }
				await drawRes.update({ remainder: drawRes.remainder - draw.transVolume });
			}));

			let receiver = await Person.findOne({_id: createdTrans.recipient});
			if(undefined === receiver.recipient){
				await receiver.update({ recipient: true });
			}
//			throw Error("Breakpoint Error");

			res.json({
				success: 'true',
				data: createdTrans
			});		  						
		} catch(err){
			console.log(err);			
			if(err.name == 'RangeError'){
				message = err.message;
			}
			res.json({
				success: false,
				message: err.message,
				type: err.name
			});
		}
	});

	// Edit transfusion
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