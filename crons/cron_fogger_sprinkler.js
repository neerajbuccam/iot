require('../mongoConnect');

var global = require('../global_config')
var gpio = require("rpi-gpio")
var ControlsModel = require('../models/controls')
var exec = require('child_process').execFile

var modeStatus = false;
var module = process.argv[2];
var mode = process.argv[3];
var runFor = process.argv[4];
var runForUnitIndex = process.argv[5];
	
var runFor_In_mSeconds = (runForUnitIndex == 0)
	? runFor * 60 * 1000
	: runFor * 60 * 60 * 1000;

if (mode == 'autoMode') {
	var interval = process.argv[6];
	var intervalUnitIndex = process.argv[7];
	
	var interval_In_mSeconds = (intervalUnitIndex == 0)
		? interval * 60 * 1000
		: interval * 60 * 60 * 1000;
}

var SIGTERM = false;

var dbQuery = module + 's.' + mode + '.status';
var key1status = module + 's.' + module + 'Side1.status';
var key2status = module + 's.' + module + 'Side2.status';

if (module == 'fogger') {
	var side1 = global.pins.foggerSide1;
	var side2 = global.pins.foggerSide2;
}
else if (module == 'sprinkler') {
	var side1 = global.pins.sprinklerSide1;
	var side2 = global.pins.sprinklerSide2;
}	

var half_runFor_In_mSeconds = parseInt(runFor_In_mSeconds / 2);
	
function toggleModule(side, data){
	var update = {};
	side == 'side1' ? update[key1status] = data : null;
	side == 'side2' ? update[key2status] = data : null;

	var options = { new: true, projection: { _id: 0 } };
	ControlsModel.findOneAndUpdate({}, update, options, function(){});
}

function togglePin(pin, side, direction, data){
/*	var d = (direction == 'in') ? gpio.DIR_IN : gpio.DIR_OUT;
	gpio.setup(pin, d, function(){
		gpio.write(pin, data, function(err) {
			if (err)
				console.log('error: ' + err);
			
*/			if (!SIGTERM)
				toggleModule(side, data);
			console.log(module + ' ' + pin + ' is ' + (data ? 'ON' : 'OFF'));
/*		});
	});
*/
}

function terminateScript(){
	SIGTERM = true;
	togglePin(side1, 'side1', 'in', false);
	togglePin(side2, 'side2', 'in', false);
	exec('kill', [process.pid]);
}

process.on('SIGTERM', function() {
	var update = {};
	update[key1status] = false;
	update[key2status] = false;
	ControlsModel.findOneAndUpdate({}, update, function(err){
		if (err)
			console.log(err);
		console.log('Killing Process (Auto is OFF / Timeout): ', process.pid);
		process.exit(0);
	});
});

//	Listen to Auto Mode Status every 5 seconds and Terminate Script if false
setInterval(function(){
	ControlsModel.distinct(dbQuery).exec(
		function (err, status) {
			modeStatus = status[0];
			if (!modeStatus)
				terminateScript();
		}
	);
}, 5000);

//	Toggle process
function start(){
	ControlsModel.distinct(dbQuery).exec(
		function (err, status) {
			modeStatus = status[0];
			if (modeStatus) {
				togglePin(side1, 'side1', 'in', false);
				togglePin(side2, 'side2', 'in', false);
				togglePin(side1, 'side1', 'in', true);
				
				setTimeout(function(){
					togglePin(side1, 'side1', 'in', false);
					togglePin(side2, 'side2', 'in', true);
				}, half_runFor_In_mSeconds);
				
				setTimeout(function(){
					togglePin(side2, 'side2', 'in', false);
					
					if (mode == 'manualMode')
						terminateScript();
				}, runFor_In_mSeconds);
				
			}
			else {
				terminateScript();
			}
		}
	);
}

if (typeof(runFor_In_mSeconds) == 'number' && runFor_In_mSeconds >= 5000) {

	start();
	
	if (mode == 'autoMode' && (typeof(interval_In_mSeconds) == 'number' && interval_In_mSeconds >= 5000)) {
		setInterval(function(){
			start();
		}, interval_In_mSeconds);
	}
	
}
