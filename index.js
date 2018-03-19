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

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	if ('OPTIONS' == req.method) {
		res.send(200);
	} else {
		next();
	}
});

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

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

// Imported Routes
app.use(require('./controllers')(passport));

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
