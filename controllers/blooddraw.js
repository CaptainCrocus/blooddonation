var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var BloodDraw = require('../models/blooddraw');

// Fetch all blooddraws
router.get('/blooddraw', (req, res) => {
	BloodDraw.find({})
	.populate('person')
	.populate('bloodType')
	.populate('source')
	.exec(function(err, blooddraws){
		if(err){
			console.log("/person|get - error: ", error);
			res.json({
				success: false,
				message: 'Wrong query'
			});
		}
		else{
			console.log(blooddraws);
			res.json({
				success: true,
				data: blooddraws
			});
		}
	});
});

// Fetch single blooddraw
router.get('/blooddraw/:id', (req, res)=>{
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

// Add blooddraw
router.post('/blooddraw', 
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
		var blooddrawInfo = matchedData(req);
		blooddrawInfo.remainder = blooddrawInfo.volume;
		console.log(blooddrawInfo);
		BloodDraw.create(blooddrawInfo, (err, blooddraw)=>{
			if(err){
				console.log("/blooddraw|post - error: ", err);
				res.json({
					success: false,
					message: 'Wrong query'
				});
			}
			else{
				res.json({
					success: "true",
					data: blooddraw
				});
			}
		});
});

// Add blooddraw
router.put('/blooddraw/:id', 
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