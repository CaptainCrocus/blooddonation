const express = require('express');
const PORT = process.env.PORT || 5000;
const handlebars = require('express-handlebars').create({
	defaultLayout: 'main',
	helpers: {
		section: function(name, options){
			if(!this._sections) 
				this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}
	}
});
const bodyParser = require('body-parser');
var mongoose = require('mongoose');

var credentials = require('./conf/credentials');

var app = express();

/// База данных ////////////////////////////////////////////////////////////////
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

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'connection success!'));
////////////////////////////////////////////////////////////////////////////////
// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: credentials.cookieSecret}));
app.use(passport.initialize());
app.use(passport.session());
////////////////////////////////////////////////////////////////////////////////

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(require('cors')());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

// Imported Routes

var person = require('./controllers/person');
var bloodtype = require('./controllers/bloodtype');
var source = require('./controllers/source');
var draw = require('./controllers/draw');
var transfusion = require('./controllers/transfusion');
var gui = require('./controllers/gui')(passport);

app.use(gui);
app.use('/api', person);
app.use('/api', bloodtype);
app.use('/api', source);
app.use('/api', draw);
app.use('/api', transfusion);

// пользовательская страница 404
app.use(function(req, res){
	// res.type('text/plain');
	// res.status(404);
	//res.send('404 — Не найдено');
	res.redirect(308, '/');
});
// пользовательская страница 500
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 — Ошибка сервера');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
