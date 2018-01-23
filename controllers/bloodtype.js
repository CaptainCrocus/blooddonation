var express = require('express');
var router = express.Router();

var BloodType = require('../models/bloodtype');

// Fetch all blood types
router.get('/bloodtype', (req, res) => {
	console.log("Blood Types list");
	BloodType.find({}, function(err, bloodtypes){
		if(err){
			console.log("/bloodtype|get - error: ", error);
			res.json({
				success: false,
				message: 'Wrong query'
			});
		}
		else{
			res.json({
				success: "true",
				data: bloodtypes
			});
		}
	});
});

module.exports = router;