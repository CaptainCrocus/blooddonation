module.exports = {
	cookieSecret: 'MoPnoWBPhm',
	mongo: {
		development: {
			connectionString: 'mongodb://localhost:27017/blooddonor',
		},
		production: {
			connectionString: process.env.MONGODB_URI_BLOODDONOR,
		}
	}
};