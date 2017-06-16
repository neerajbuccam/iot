//	DB Connection
var mongoose = require("mongoose");
mongoose.connect('mongodb://neeraj:polyhouse@ds064799.mlab.com:64799/polyhouse');

var global = require('../global_config')
var gpio = require("rpi-gpio")
var ControlsModel = require('../models/controls')
var exec = require('child_process').execFile

var foggerSide1 = global.pins.foggerSide1;
var foggerSide2 = global.pins.foggerSide2;

var autoModeStatus = false;
var isFirstRun = true;

var interval = process.argv[2];
var intervalUnitIndex = process.argv[3];
var runFor = process.argv[4];
var runForUnitIndex = process.argv[5];

var interval_In_mSeconds = (intervalUnitIndex == 0)
	? interval * 60 * 1000
	: interval * 60 * 60 * 1000;
	
var runFor_In_mSeconds = (runForUnitIndex == 0)
	? runFor * 60 * 1000
	: runFor * 60 * 60 * 1000;
	
var half_runFor_In_mSeconds = parseInt(runFor_In_mSeconds / 2);
	
function togglePin(pin, direction, data){
/*	var d = (direction == 'in') ? gpio.DIR_IN : gpio.DIR_OUT;
	gpio.setup(pin, d, function(){
		gpio.write(pin, data, function(err) {
			if (err)
				console.log('error: ' + err);
*/			console.log('FOGGERS PIN ' + pin + ' is ' + ((data == 1) ? 'ON' : 'OFF'));
/*		});
	});
*/
}

function terminateScript(){
	togglePin(foggerSide1, 'in', 0);
	togglePin(foggerSide2, 'in', 0);
	console.log('Killing Process (Auto is OFF / Timeout): ', process.pid);
	exec('kill', [process.pid]);
}

//	Listen to Auto Mode Status every 5 seconds and Terminate Script if false
setInterval(function(){
	ControlsModel.distinct('foggers.autoMode.status').exec(
		function (err, status) {
			autoModeStatus = status[0];
			if (!autoModeStatus)
				terminateScript();
		}
	);
}, 5000);

//	Foggers toggle process
function start(){
	ControlsModel.distinct('foggers.autoMode.status').exec(
		function (err, status) {
			autoModeStatus = status[0];
			if (autoModeStatus) {
				if (isFirstRun) {
					togglePin(foggerSide1, 'in', 0);
					togglePin(foggerSide2, 'in', 0);
					togglePin(foggerSide1, 'in', 1);
					isFirstRun = false;
					
					setTimeout(function(){
						togglePin(foggerSide1, 'in', 0);
						isFirstRun = true;
						togglePin(foggerSide2, 'in', 1);
					}, half_runFor_In_mSeconds);
					
					setTimeout(function(){
						togglePin(foggerSide2, 'in', 0);
					}, runFor_In_mSeconds);
				}
			}
			else {
				terminateScript();
			}
		}
	);
}

if ((typeof(interval_In_mSeconds) == 'number' && interval_In_mSeconds >= 5000)
	&& (typeof(runFor_In_mSeconds) == 'number' && runFor_In_mSeconds >= 5000)) {

	start();
	
	setInterval(function(){
		start();
	}, interval_In_mSeconds);
}
