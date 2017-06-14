var mongoose = require("mongoose");

//	DB Connection
mongoose.connect('mongodb://neeraj:polyhouse@ds064799.mlab.com:64799/polyhouse');

var ControlsModel = require('../models/controls')
var TempHumidityModel = require('../models/tempHumidity')
var TempHumidityLib = require("node-dht-sensor")
var exec = require('child_process').execFile

var interval = process.argv[2];
var intervalUnitIndex = process.argv[3];

var interval_In_Seconds = (intervalUnitIndex == 0)
	? interval * 60 * 1000
	: interval * 60 * 60 * 1000;

if (typeof(interval_In_Seconds) == 'number' && interval_In_Seconds >= 5000) {
	
	setInterval( function(){
		
		ControlsModel.distinct('temp_humidity.autoMode.status').exec(
			function (err, status) {
				if (status[0]) {
					console.log('Capturing...');
					var document = [];
					//var data = TempHumidityLib.read(11, pin=23);
					/*var reading = {
						sensor: 'Temp_Humidity_1',
						temperature: data.temperature.toFixed(1),
						humidity: data.humidity.toFixed(1),
						date: new Date()
					};*/
					var reading = {
						sensor: 'Temp_Humidity_1',
						temperature: ((Math.random() * 100) + 1).toFixed(0),
						humidity: ((Math.random() * 100) + 1).toFixed(0),
						date: new Date()
					};
					
					document.push(reading);
					TempHumidityModel.collection.insert(document);
				}
				else {
					console.log('Killing Process (Auto is OFF): ', process.pid);
					exec('kill', [process.pid]);
				}
			}
		);
		
	}, interval_In_Seconds);
}
