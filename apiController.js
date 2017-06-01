var apiRoutes = require("express").Router();

var TempHumidityModel = require('./db/tempHumidity');
//var ControlsModel = require('./db/controls');
	
	function getTempHumidity(req, res){
		TempHumidityModel.findOne({}, {_id: 0}).sort({date: -1})
			.exec(
				function (err, tempHumidity) {
					if (err)
						res.send(err);
					else
						res.json(tempHumidity);
				});
	}

	function toggleTempHumidity(req, res){
		res.json("post");
	}	
	
	apiRoutes.route('/temp-humidity/get_temp_humidity').get(getTempHumidity);
	apiRoutes.route('/temp-humidity/toggle_temp_humidity').post(toggleTempHumidity);

module.exports = apiRoutes;
