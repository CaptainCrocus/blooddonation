const express = require('express');
const PORT = process.env.PORT || 5000;
const handlebars = require('express-handlebars').create({
	defaultLayout: 'main'
});
var mongoose = require('mongoose');

var person = require('./controllers/person');
var gui = require('./controllers/gui');

var credentials = require('./conf/credentials');

var app = express();

/// База данных //////////////////////////////////////////////////////////////////
opts = { 
	useMongoClient: true,
	keepAlive: true,
	autoReconnect: true,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 500
};
switch(app.get('env')){
	case 'development':
		mongoose.connect(credentials.mongo.development.connectionString, opts);
		break;
	case 'production':
		mongoose.connect(credentials.mongo.production.connectionString, opts);
		break;
	default:
		throw new Error('Неизвестная среда выполнения: ' + app.get('env'));
}
////////////////////////////////////////////////////////////////////////////////

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'connection success!'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());

app.get('/', (req, res) => {
	res.render('login');
});

// Imported Routes
app.use(gui);
app.use('/api/person', person);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
