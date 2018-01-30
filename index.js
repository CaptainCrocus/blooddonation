const express = require('express');
const PORT = process.env.PORT || 5000;
const handlebars = require('express-handlebars').create({
	defaultLayout: 'main'
});
var mongoose = require('mongoose');

var credentials = require('./conf/credentials');

var person = require('./controllers/person');
var bloodtype = require('./controllers/bloodtype');
var bloodsource = require('./controllers/bloodsource');
var blooddraw = require('./controllers/blooddraw');
var gui = require('./controllers/gui');

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
app.use(require('cors')());

app.get('/', (req, res) => {
	res.render('login');
});

// Imported Routes
app.use(gui);
app.use('/api', person);
app.use('/api', bloodtype);
app.use('/api', bloodsource);
app.use('/api', blooddraw);

// пользовательская страница 404
app.use(function(req, res){
	res.type('text/plain');
	res.status(404);
	res.send('404 — Не найдено');
});
// пользовательская страница 500
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 — Ошибка сервера');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
