var express = require('express');
var router = express.Router();

var BloodType = require('../models/bloodtype');

// Fetch all blood types
module.exports = function(){

	router.get('/', (req, res) => {
		BloodType.find({}, function(err, bloodtypes){
			if(err){
				console.log("/bloodtype|get - error: ", err);
				res.json({
					success: false,
					message: 'Wrong query'
				});
			}
			else{
				res.json({
					success: true,
					data: bloodtypes
				});
			}
		});
	});
	return router;
};