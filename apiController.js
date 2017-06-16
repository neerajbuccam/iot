var apiRoutes = require("express").Router();

var ControlsModel = require('./models/controls');
var TempHumidityModel = require('./models/tempHumidity');
var CronModel = require('./models/cron');

exec = require('child_process').execFile;
fork = require('child_process').fork;
	
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
				console.log('Killing Process: ', cron[0]);
				exec('kill', [cron[0]]);
			}
		);
	}

	function createCron(update_module, path, args){
		
		killCron(update_module);
		
		var forkProcess = fork(path, args);
		
		console.log('Creating Process: ', forkProcess.pid);
		
		var update= {};
		update[update_module] = forkProcess.pid;
		var options = { new: true, projection: { _id: 0 } };

		CronModel.findOneAndUpdate({}, update, options, function(err, doc){  
			return (err) ? false : true;
		});
	}

//	TEMPERATURE & HUMIDITY
	
	function getTempHumidity(req, res){
		TempHumidityModel.find({}, {_id: 0}).sort({date: -1})
			.exec(
				function (err, tempHumidity) {
					if (err)
						res.send(err);
					else
						res.json(tempHumidity);
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
		var args = req.body.args;
		
		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else{
				var args = [
					req.body.args.interval,
					req.body.args.intervalUnitIndex
				];
				
				doc.cron = createCron('temp_humidity.autoMode.process',
					'./crons/cron_tempHumidity.js',
					args
				);
				
				res.json({controls: doc});
			}
		});
	}
	
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
					req.body.args.interval,
					req.body.args.intervalUnitIndex,
					req.body.args.runFor,
					req.body.args.runForUnitIndex
				];
				
				doc.cron = createCron('foggers.autoMode.process',
					'./crons/cron_foggers.js',
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
			else
				res.json({controls: doc});
		});
	}
	
	apiRoutes.route('/controls/get_controls').get(getControls);
	apiRoutes.route('/controls/tempHumidity_toggleAutoMode').post(tempHumidityToggleAutoMode);
	apiRoutes.route('/controls/temp_humidity_resetAutoMode').post(tempHumidityResetAutoMode);
	apiRoutes.route('/controls/toggle_fogger').post(toggleFogger);
	apiRoutes.route('/controls/fogger_toggleAutoMode').post(foggerToggleAutoMode);
	apiRoutes.route('/controls/fogger_resetAutoMode').post(foggerResetAutoMode);
	apiRoutes.route('/controls/fogger_toggleManualMode').post(foggerToggleManualMode);
	apiRoutes.route('/controls/fogger_startManualMode').post(foggerStartManualMode);	
	apiRoutes.route('/temp-humidity/get_temp_humidity').get(getTempHumidity);

module.exports = apiRoutes;
