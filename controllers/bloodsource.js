var express = require('express');
var router = express.Router();

var BloodSource = require('../models/bloodsource');

// Fetch all blood types
router.get('/bloodsource', (req, res) => {
	BloodSource.find({}, function(err, bloodsources){
		if(err){
			console.log("/bloodsource|get - error: ", err);
			res.json({
				success: false,
				message: 'Wrong query'
			});
		}
		else{
			res.json({
				success: true,
				data: bloodsources
			});
		}
	});
});

module.exports = router;