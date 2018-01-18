module.exports = {
	mongo: {
		development: {
			connectionString: 'mongodb://localhost:27017/blooddonor',
		},
		production: {
			connectionString: 'mongodb://blood:blood@ds151207.mlab.com:51207/heroku_mf2mgkt8',
		}
	}
};