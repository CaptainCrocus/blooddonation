const express = require('express');
const router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const Transfusion = require('../models/transfusion');
const Draw = require('../models/draw');
const Person = require('../models/person');

module.exports = function(){
	// Fetch all transfusions
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

				findObj.$and.push({recipient: {$in: persons_ids}});
			}

			const response = await Transfusion.find(findObj.$and.length ? findObj : {})
				.sort(sortObj)
				.skip(offset)
				.limit(limit)
				.populate('source')
				.populate('recipient')
				.populate({ path: 'recipient', populate: { path: 'bloodType', select: '_id typeName' }})
				.lean()

			const count = await Transfusion.count(findObj.$and.length ? findObj : {});

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
				errors: [{type: err.type, message: err.message}]
			});
		}
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
			.populate({ path: 'draws.draw'})
			.populate({ path: 'draws.draw', model: 'Draw', populate: { path: 'person', model: 'Person'}})
			.populate({ path: 'draws.draw', model: 'Draw', populate: { path: 'bloodType', model: 'BloodType'}})
			.populate({ path: 'draws.draw', model: 'Draw', populate: { path: 'source', model: 'Source'}})
			.populate('recipient')
			.populate({ path: 'recipient', model: 'Person', populate: { path: 'bloodType', model: 'BloodType'}})
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
			const transInfo = matchedData(req);
			transInfo.volume = transInfo.draws.reduce((sum, draw)=>{
				return sum + parseInt(draw.transVolume);
			}, 0);

			if (!errors.isEmpty()) {
	    		return res.status(422).json({ errors: errors.mapped() });
	  		}

			const receiver = await Person.findOne({_id: transInfo.recipient});

			if(receiver === null){
				throw Error('There is not the recipient with id = ' + transInfo.recipient + ' in the DataBase');
			}
			
			transInfo.bloodType = receiver.bloodType;

			transInfo.date = moment(transInfo.date, "DD.MM.YYYY HH:mm");
			
			let draws = await Draw.find({
				_id: {
					$in: transInfo.draws.map(function(draw) {
  					return draw._id;
					})
				}
			})
			.select('_id remainder');

			if(draws.length != transInfo.draws.length){
				throw Error("There aren't some draws in the DataBase");
			}

			transInfo.draws.forEach((draw, index, array)=>{
				let dbDraw = draws.filter((item, index, array) =>{
					return item._id == draw._id;
				})[0];
				if(draw.transVolume > dbDraw.remainder){
					throw new RangeError('The transfusion volume is greater than draw remainder volume');
				}
				else{
					dbDraw.newRemainder = dbDraw.remainder - draw.transVolume;
				}
			});

			await Promise.all(draws.map(async (draw)=>{
				await draw.update({remainder: draw.newRemainder});
			}));

			transInfo.draws = transInfo.draws.map(function(draw) {
  				return { draw: draw._id, transVolume: draw.transVolume};
			});

			const trans = new Transfusion(transInfo);
			const createdTrans = await trans.save();

			if(undefined === receiver.recipient){
				await receiver.update({ recipient: true });
			}

			res.json({
				success: 'true',
				data: createdTrans
			});		  						
		} catch(err){
			console.log(err);			
			res.json({
				success: false,
				errors: [{message: err.message, type: err.name}]
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