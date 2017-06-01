//var fs = require('fs')
var TempHumidityModel = require("./db").TempHumidityModel
var TempHumidityLib = require("node-dht-sensor")

setInterval( function(){
	var document = [];
	var data = TempHumidityLib.read(11, pin=23);
	 document = {
		sensor: 'Temp_Humidity_1',
		temperature: data.temperature.toFixed(1),
		humidity: data.humidity.toFixed(1),
		date: new Date()
	};
	
	document.push(reading);
	TempHumidityModel.collection.insert(document);
	
}, 5000);

//var test = fs.open('test.txt','w+', function(){
//	fs.writeFile('test.txt',"hellooooooo");
//});
//fs.close(test);
