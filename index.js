const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
var mongoose = require('mongoose');

var app = express();
const connectionString = "mongodb://blood:blood@ds151207.mlab.com:51207/heroku_mf2mgkt8";
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

mongoose.connect(connectionString);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'connection success!'));

var personSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    middleName: String,
    passport: String,
    fin: String,
    address: String,
    phone: String,
    mobile: String,
    sex: Boolean,
    description: String
});

var Peoples = mongoose.model('Peoples', personSchema, 'Peoples');

Peoples.find(function (err, persons) {
  if (err) 
  	return console.error(err);
  console.log(persons);
});