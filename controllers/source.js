var express = require('express');
var router = express.Router();

var Source = require('../models/source');

// Fetch all sources
module.exports = function(){
	
	router.get('/', (req, res) => {
		Source.find({}, function(err, sources){
			if(err){
				res.json({
					success: false,
					message: 'Wrong query'
				});
			}
			else{
				res.json({
					success: true,
					data: sources
				});
			}
		});
	});

	return router;
}