module.exports = {
	cookieSecret: process.env.COOKIE_SECRET,
	mongo: {
		development: {
			connectionString: 'mongodb://localhost:27017/blooddonor',
		},
		production: {
			connectionString: process.env.MONGODB_URI_BLOODDONOR,
		}
	}
};