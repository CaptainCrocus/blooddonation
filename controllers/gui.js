var express = require('express');
var router = express.Router();

router.get('/person/add', function(req, res){
	res.render('addperson');
})

module.exports = router;