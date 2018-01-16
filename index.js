const express = require('express');
const PORT = process.env.PORT || 5000;
const handlebars = require('express-handlebars').create({
	defaultLayout: 'main'
});
var person = require('./controllers/person');
var gui = require('./controllers/gui');
var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());

app.get('/', (req, res) => {
	res.render('login');
});

app.use(gui);
app.use('/api/person', person);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
