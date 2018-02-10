const express = require('express');
const router = express.Router();
const moment = require('moment');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var Draw = require('../models/draw');
var Transfusion = require('../models/transfusion');
var Person = require('../models/person');

// Fetch all transfusions
router.get('/trans', (req, res) => {
	res.json({
		success: true,
		data: "Not realized yet"
	});
});

// Fetch single transfusion
router.get('/trans/:id', (req, res)=>{
	res.json({
		success: true,
		data: draw
	});
});

// Add transfusion
router.post('/trans', 
	[
		check('volume').exists(),
		check('source').exists(),
		check('draw').exists(),
		check('bloodType').exists(),
		check('recipient').exists(),
		check('description').optional({ checkFalsy: true }),
		check('date').exists()
	], async (req, res)=>{
	const errors = validationResult(req)
	var transInfo = matchedData(req);

	try{
		let draw = await Draw.findOne({_id: transInfo.draw}).lean();
		if(transInfo.volume > draw.remainder){
			throw new RangeError('The transfusion volume is greater than draw volume');
		}

		let trans = new Transfusion(transInfo);
		let createdTrans = await trans.save();

		let drawRes = await Draw.findOne({_id: createdTrans.draw});
		await drawRes.update({ remainder: drawRes.remainder - createdTrans.volume });

		let receiver = await Person.findOne({_id: createdTrans.recipient});
		if(undefined === receiver.recipient){
			await receiver.update({ recipient: true });
		}

		res.json({
			success: 'true',
			data: createdTrans
		});		  						
	} catch(err){

		let message = "Data Base Error";
		
		if(err.name = 'RangeError'){
			message = err.message;
		}
		res.json({
			success: false,
			message: message
		});
	}
});

// Edit transfusion
// TODO:
router.put('/trans/:id', 
	(req, res)=>{
	res.json({
		success: "false",
		message: "Not realized!"
	});
});

module.exports = router;