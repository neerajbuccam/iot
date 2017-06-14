var mongoose = require("mongoose");

var CronSchema = new mongoose.Schema({
		foggers: {
			autoMode: {
				process: Number
			},
			manualMode: {
				process: Number
			}
		},
		sprinklers: {
			autoMode: {
				process: Number
			},
			manualMode: {
				process: Number
			}
		},
		temp_humidity: {
			autoMode: {
				process: Number
			}
		}
	});
	
module.exports = mongoose.model('Cron', CronSchema);
