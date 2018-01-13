const express = require('express');
const PORT = process.env.PORT || 5000;
const handlebars = require('express-handlebars').create({
	defaultLayout: 'main'
});

var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
	res.render('login');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
