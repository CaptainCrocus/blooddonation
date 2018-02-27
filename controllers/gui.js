var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

module.exports = function(passport){

	router.get('/', isAuthenticated, (req, res) => {
		res.render('index');
	});

	router.get('/login', (req, res) => {
		res.render('login');
	});

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash : true  
	}));

	router.get('/signup', (req, res) => {
		res.render('register');
	});

	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});
	return router;
};