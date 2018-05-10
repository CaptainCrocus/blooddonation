var express = require('express')
  , router = express.Router()

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.json({
		success: false,
		redirect: '/login'
	});
}
module.exports = function(passport){
	const gui = require('./gui')(passport);
	const bloodtype = require('./bloodtype')();
	const person = require('./person')();
	const source = require('./source')();
	const draw = require('./draw')();
	const transfusion = require('./transfusion')();

	router.use(gui);
	router.use('/api/person', /*isAuthenticated,*/ person);
	router.use('/api/bloodtype', /*isAuthenticated,*/ bloodtype);
	router.use('/api/source', /*isAuthenticated,*/ source);
	router.use('/api/draw', /*isAuthenticated,*/ draw);
	router.use('/api/trans', /*isAuthenticated,*/ transfusion);

	return router
};