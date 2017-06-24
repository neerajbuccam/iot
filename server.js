var express = require("express");
var bodyParser = require('body-parser');
require('./mongoConnect');
var apiController = require("./apiController");
var sensor = require("./sensor");
var fork = require('child_process').fork;

var app = express();
var port = 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', apiController);

app.get('*.js', function (req, res, next) {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	next();
});

app.get('*', function (req, res) {
   res.sendFile( __dirname + "/views/" + "index.html" );
})


app.listen(port, function(){
	console.log('server started on port ' + port);
});

//var testfork = fork('./cron_tempHumidity.js');
//testfork.kill();

//sensor.read();
//setInterval(function(){
//	sensor.light.on();
//	setTimeout(function(){
//		sensor.light.off();
//	}, 5000);
//}, 2000);
