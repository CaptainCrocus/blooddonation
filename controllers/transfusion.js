const express = require('express');
const router = express.Router();
const moment = require('moment');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var Draw = require('../models/draw');
var Transfusion = require('../models/Transfusion');

// Fetch all transfusions
router.get('/transfusion', (req, res) => {
	res.json({
		success: true,
		data: "Not realized yet"
	});
});

// Fetch single transfusion
router.get('/transfusion/:id', (req, res)=>{
	res.json({
		success: true,
		data: draw
	});
});

// Add transfusion
router.post('/transfusion', 
	[
		check('volume').exists(),
		check('source').exists(),
		check('draw').exists(),
		check('bloodType').exists(),
		check('recipient').exists(),
		check('date').exists()
	], async (req, res)=>{
	const errors = validationResult(req)
	var transfusionInfo = matchedData(req);

	transfusionInfo.remainder = transfusionInfo.volume;
	console.log(transfusionInfo);
	try{
		var transfusion = new Transfusion(transfusionInfo);
		let newTransfusion = await transfusion.save();
		res.json({
			success: "true",
			data: newTransfusion
		});		  						
	} catch(err){
		console.log("/draw|post - error: ", err);
		res.json({
			success: false,
			message: 'Wrong query'
		});
	}
});

// Edit transfusion
// TODO:
router.put('/transfusion/:id', 
	(req, res)=>{
	res.json({
		success: "false",
		message: "Not realized!"
	});
});

module.exports = router;