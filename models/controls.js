var mongoose = require("mongoose");

var ControlsSchema = new mongoose.Schema({
		water_pump: {
			status					: Boolean,
			run_for					: Number
		},
		foggers: {
			foggerSide1: {
				status				: Boolean
			},
			foggerSide2: {
				status				: Boolean
			},
			autoMode: {
				status				: Boolean,
				interval			: Number,
				intervalUnitIndex	: Number,
				runFor				: Number,
				runForUnitIndex		: Number
			},
			manualMode: {
				status				: Boolean,
				runFor				: Number,
				runForUnitIndex		: Number
			}
		},
		sprinklers: {
			sprinklerSide1: {
				status				: Boolean
			},
			sprinklerSide2: {
				status				: Boolean
			},
			autoMode: {
				status				: Boolean,
				interval			: Number,
				intervalUnitIndex	: Number,
				runFor				: Number,
				runForUnitIndex		: Number
			},
			manualMode: {
				status				: Boolean,
				runFor				: Number,
				runForUnitIndex		: Number
			}
		},
		temp_humidity: {
			autoMode: {
				status				: Boolean,
				interval			: Number,
				intervalUnitIndex	: Number
			}
		},
		light_1: {
			status					: Boolean
		}
	});
	
module.exports = mongoose.model('Controls', ControlsSchema);
