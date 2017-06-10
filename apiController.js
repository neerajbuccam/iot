var apiRoutes = require("express").Router();

var ControlsModel = require('./db/controls');
var TempHumidityModel = require('./db/tempHumidity');
	
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

	function toggleTempHumidity(req, res){
		var update  = { 'temp_humidity.status': req.body.status };  
		var options = { new: true, projection: { _id: 0 } }; 

		ControlsModel.findOneAndUpdate({}, update, options, function(err, doc){  
			if (err)
				res.send(err);
			else
				res.json({controls: doc});
		});
	}
	
	function updateTempHumidityInterval(req, res){
		var update  = {'temp_humidity.interval': req.body.interval, 'temp_humidity.unitIndex': req.body.unitIndex};  
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
	
	apiRoutes.route('/controls/get_controls').get(getControls);
	apiRoutes.route('/controls/toggle_temp_humidity').post(toggleTempHumidity);
	apiRoutes.route('/controls/update_temp_humidity_interval').post(updateTempHumidityInterval);
	apiRoutes.route('/controls/fogger_toggleAutoMode').post(foggerToggleAutoMode);	
	apiRoutes.route('/temp-humidity/get_temp_humidity').get(getTempHumidity);

module.exports = apiRoutes;
