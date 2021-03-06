var apiRoutes = require("express").Router();

var ControlsModel = require('./models/controls');
var TempHumidityModel = require('./models/tempHumidity');
var CronModel = require('./models/cron');

var global = require('./global_config')
var gpio = require("rpi-gpio")
var moment = require('moment');
exec = require('child_process').execFile;
fork = require('child_process').fork;

//	SWITCH

	function togglePin(module, data){
		var pin = global.pins[module];
		gpio.setup(pin, gpio.DIR_OUT, function(){
			gpio.write(pin, data, function(err) {
				if (err)
					console.log('error: ' + err);
				console.log(module + ' is ' + (data ? 'ON' : 'OFF'));
			});
		});
	}
	
//	CRON
	
	function getCrons(req, res){
		CronModel.find({}, {_id: 0}).exec(
			function (err, crons) {
				if (err)
					res.send(err);
				else
					res.json(crons);
			}
		);
	}
	
	function killCron(module){
		CronModel.distinct(module).exec(
			function (err, cron) {
				exec('kill', [cron[0]]);
				console.log('Killing Process: ', cron[0]);
			}
		);
	}

	function processCron(update_module, path, args){
		CronModel.distinct(update_module).exec(
			function (err, cron) {
				exec('kill', [cron[0]]);
				console.log('Killing Process: ', cron[0]);
				
				var forkProcess = fork(path, args);
				console.log('Creating Process: ', forkProcess.pid);
				
				var update= {};
				update[update_module] = forkProcess.pid;
				var options = { new: true, projection: { _id: 0 } };

				CronModel.findOneAndUpdate({}, update, options, function(err, doc){  
					return (err) ? false : true;
				});
			}
		);
	}

//	CONTROLS
	
	function getControls(req, res){
		ControlsModel.findOne({}, {_id: 0}).exec(
			function (err, controls){
				if(err)
					res.send(err);
				else
					res.json(controls);
			}
		);
	}

//	TEMPERATURE & HUMIDITY
	
	function getTempHumidity(req, res){
		
		TempHumidityModel.find({}, {_id: 0, sensor: 0})
			.sort({date: -1})
			.limit(1)
			.exec(
				function (err, tempHumidity) {
					if (err)
						res.send(err);
					else
						res.json(tempHumidity);
				}
			);
	}
	
	function filterTempHumidity(req, res){
		var dateFrom, dateTo;
		
		if (req.body.date) {
			dateFrom = moment(req.body.date);
			dateFrom.startOf('day');
			dateTo = dateFrom.clone().add(1, 'days');
		}
		else {
			dateFrom = moment();
			dateFrom.startOf('day');
			dateTo = dateFrom.clone().add(1, 'days');
		}
		
		TempHumidityModel.find({
				date: {
					$gte: dateFrom,
					$lt:  dateTo
				}
			}, {_id: 0, sensor: 0})
			.sort({date: 1})
			.exec(
				function (err, tempHumidity) {
					if (err)
						res.send(err);
					else
						res.json(tempHumidity);
				}
			);
	}

	function tempHumidityToggleAutoMode(req, res){
		var update  = { 'temp_humidity.autoMode.status': req.body.status };  
		var options = { new: true, projection: { _id: 0 } };

		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){
			if (err)
				res.send(err);
			else{
				if (!req.body.status){
					killCron('temp_humidity.autoMode.process');
				}
				res.json({controls: doc});
			}
		});
	}
	
	function tempHumidityResetAutoMode(req, res){
		var update  = {
			'temp_humidity.autoMode.interval': req.body.interval,
			'temp_humidity.autoMode.intervalUnitIndex': req.body.intervalUnitIndex
		};  
		var options = { new: true, projection: { _id: 0 } };
		
		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else{
				var args = [
					req.body.args.interval,
					req.body.args.intervalUnitIndex
				];
				
				doc.cron = processCron('temp_humidity.autoMode.process',
					'./crons/cron_tempHumidity.js',
					args
				);
				
				res.json({controls: doc});
			}
		});
	}

//	FOGGERS
	
	function toggleFogger(req, res){
		var update  = (req.body.side == 'side1')
			? { 'foggers.foggerSide1.status': req.body.status }
			: { 'foggers.foggerSide2.status': req.body.status };  
		var options = { new: true, projection: { _id: 0 } }; 

		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else
				res.json({controls: doc});
		});
	}
	
	function foggerToggleAutoMode(req, res){
		var update  = { 'foggers.autoMode.status': req.body.status };  
		var options = { new: true, projection: { _id: 0 } }; 

		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else
				res.json({controls: doc});
		});
	}
	
	function foggerResetAutoMode(req, res){
		var update  = {
			'foggers.autoMode.interval': req.body.interval,
			'foggers.autoMode.intervalUnitIndex': req.body.intervalUnitIndex,
			'foggers.autoMode.runFor': req.body.runFor,
			'foggers.autoMode.runForUnitIndex': req.body.runForUnitIndex
		};  
		var options = { new: true, projection: { _id: 0 } }; 
		
		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else{
				var args = [
					'fogger',
					'autoMode',
					req.body.args.runFor,
					req.body.args.runForUnitIndex,
					req.body.args.interval,
					req.body.args.intervalUnitIndex
				];
				
				doc.cron = processCron('foggers.autoMode.process',
					'./crons/cron_fogger_sprinkler.js',
					args
				);
				
				res.json({controls: doc});
			}
		});
	}
	
	function foggerToggleManualMode(req, res){
		var update  = { 'foggers.manualMode.status': req.body.status };  
		var options = { new: true, projection: { _id: 0 } }; 

		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else
				res.json({controls: doc});
		});
	}
	
	function foggerStartManualMode(req, res){
		var update  = {
			'foggers.manualMode.runFor': req.body.runFor,
			'foggers.manualMode.runForUnitIndex': req.body.runForUnitIndex
		};
		var options = { new: true, projection: { _id: 0 } }; 
		
		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else{
				var args = [
					'fogger',
					'manualMode',
					req.body.args.runFor,
					req.body.args.runForUnitIndex
				];
				
				doc.cron = processCron('foggers.manualMode.process',
					'./crons/cron_fogger_sprinkler.js',
					args
				);
				
				res.json({controls: doc});
			}
		});
	}

//	SPRINKLERS

	function toggleSprinkler(req, res){
		var update  = (req.body.side == 'side1')
			? { 'sprinklers.sprinklerSide1.status': req.body.status }
			: { 'sprinklers.sprinklerSide2.status': req.body.status };  
		var options = { new: true, projection: { _id: 0 } }; 

		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else
				res.json({controls: doc});
		});
	}
	
	function sprinklerToggleAutoMode(req, res){
		var update  = { 'sprinklers.autoMode.status': req.body.status };  
		var options = { new: true, projection: { _id: 0 } }; 

		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else
				res.json({controls: doc});
		});
	}
	
	function sprinklerResetAutoMode(req, res){
		var update  = {
			'sprinklers.autoMode.interval': req.body.interval,
			'sprinklers.autoMode.intervalUnitIndex': req.body.intervalUnitIndex,
			'sprinklers.autoMode.runFor': req.body.runFor,
			'sprinklers.autoMode.runForUnitIndex': req.body.runForUnitIndex
		};  
		var options = { new: true, projection: { _id: 0 } }; 
		
		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else{
				var args = [
					'sprinkler',
					'autoMode',
					req.body.args.runFor,
					req.body.args.runForUnitIndex,
					req.body.args.interval,
					req.body.args.intervalUnitIndex
				];
				
				doc.cron = processCron('sprinklers.autoMode.process',
					'./crons/cron_fogger_sprinkler.js',
					args
				);
				
				res.json({controls: doc});
			}
		});
	}
	
	function sprinklerToggleManualMode(req, res){
		var update  = { 'sprinklers.manualMode.status': req.body.status };  
		var options = { new: true, projection: { _id: 0 } }; 

		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else
				res.json({controls: doc});
		});
	}
	
	function sprinklerStartManualMode(req, res){
		var update  = {
			'sprinklers.manualMode.runFor': req.body.runFor,
			'sprinklers.manualMode.runForUnitIndex': req.body.runForUnitIndex
		};
		var options = { new: true, projection: { _id: 0 } }; 
		
		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else{
				var args = [
					'sprinkler',
					'manualMode',
					req.body.args.runFor,
					req.body.args.runForUnitIndex
				];
				
				doc.cron = processCron('sprinklers.manualMode.process',
					'./crons/cron_fogger_sprinkler.js',
					args
				);
				
				res.json({controls: doc});
			}
		});
	}
	
//	EXTRAS

	function toggleExtras(req, res){
		var update  = {};
		var module = req.body.module;
		
		update[module + '.status'] = req.body.status;
		var options = { new: true, projection: { _id: 0 } };

		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){
			if (err)
				res.send(err);
			else{
				togglePin(module, req.body.status);
				res.json({controls: doc});
			}
		});
	}
	
//	API ROUTES
	//	DASHBOARD
	apiRoutes.route('/temp-humidity/filterTempHumidity').post(filterTempHumidity);
	//	CONTROLS
	apiRoutes.route('/controls/get_controls').get(getControls);
	//	TEMPERATURE & HUMIDITY
	apiRoutes.route('/temp-humidity/get_temp_humidity').get(getTempHumidity);
	apiRoutes.route('/controls/tempHumidity_toggleAutoMode').post(tempHumidityToggleAutoMode);
	apiRoutes.route('/controls/temp_humidity_resetAutoMode').post(tempHumidityResetAutoMode);
	//	FOGGERS
	apiRoutes.route('/controls/toggle_fogger').post(toggleFogger);
	apiRoutes.route('/controls/fogger_toggleAutoMode').post(foggerToggleAutoMode);
	apiRoutes.route('/controls/fogger_resetAutoMode').post(foggerResetAutoMode);
	apiRoutes.route('/controls/fogger_toggleManualMode').post(foggerToggleManualMode);
	apiRoutes.route('/controls/fogger_startManualMode').post(foggerStartManualMode);
	//	SPRINKLERS
	apiRoutes.route('/controls/toggle_sprinkler').post(toggleSprinkler);
	apiRoutes.route('/controls/sprinkler_toggleAutoMode').post(sprinklerToggleAutoMode);
	apiRoutes.route('/controls/sprinkler_resetAutoMode').post(sprinklerResetAutoMode);
	apiRoutes.route('/controls/sprinkler_toggleManualMode').post(sprinklerToggleManualMode);
	apiRoutes.route('/controls/sprinkler_startManualMode').post(sprinklerStartManualMode);
	//	EXTRAS
	apiRoutes.route('/controls/extras_toggleModule').post(toggleExtras);

module.exports = apiRoutes;
