var mongoose = require("mongoose");

var ControlsSchema = new mongoose.Schema({
		water_pump: {
			status		: Boolean,
			run_for		: Number
		},
		foggers: {
			status		: Boolean,
			autoMode	: Boolean,
			interval	: Number,
			run_for		: Number
		},
		sprinklers: {
			status		: Boolean,
			autoMode	: Boolean,
			interval	: Number,
			run_for		: Number
		},
		temp_humidity: {
			status		: Boolean,
			interval	: Number
		},
		light_1: {
			status		: Boolean
		}
	});
	
module.exports = mongoose.model('Controls', ControlsSchema);
