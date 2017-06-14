var mongoose = require("mongoose");

var TempHumiditySchema = new mongoose.Schema({
		sensor		: String,
		temperature	: Number,
		humidity	: Number,
		date		: Date
	});
	
module.exports = mongoose.model('Temp_Humidity_Data', TempHumiditySchema);
