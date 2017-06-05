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
		TempHumidityModel.findOne({}, {_id: 0}).sort({date: -1})
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
		ControlsModel.update({'temp_humidity.status': req.body.status})
			.exec(
				function (err, status) {
					if (err)
						res.send(err);
					else
						res.json({status: status});
				}
			);
	}
	
	apiRoutes.route('/get_controls').get(getControls);
	apiRoutes.route('/temp-humidity/get_temp_humidity').get(getTempHumidity);
	apiRoutes.route('/temp-humidity/toggle_temp_humidity').post(toggleTempHumidity);

module.exports = apiRoutes;
