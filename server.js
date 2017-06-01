var express = require("express");
var mongoose = require("mongoose");
var apiController = require("./apiController");
var sensor = require("./sensor");
var fork = require('child_process').fork;

//	DB Connection
mongoose.connect('mongodb://neeraj:polyhouse@ds064799.mlab.com:64799/polyhouse');

var app = express();
var port = 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use('/api', apiController);

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
