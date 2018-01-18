var express = require('express');
var router = express.Router();

router.get('/person/add', function(req, res){
	res.render('person-add');
})

router.get('/person/list', function(req, res){
	res.render('person-list');
})

module.exports = router;