var mongoose = require("mongoose");

var ControlsSchema = new mongoose.Schema({
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
		water_pump: {
			status					: Boolean
		},
		lights_1: {
			status					: Boolean
		},
		lights_2: {
			status					: Boolean
		}
	});
	
module.exports = mongoose.model('Controls', ControlsSchema);
