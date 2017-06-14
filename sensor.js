var sensorLib = require("node-dht-sensor");
var gpio = require("rpi-gpio");
var TempHumidityModel = require('./models/tempHumidity');

var sensor = {
    sensors: [ {
        name: "Sensor1",
        pin: 23
    } ],
    read: function() {
		var sense_data = [];
		
        for (var i in this.sensors) {
            //var data = sensorLib.read(11, this.sensors[i].pin);
			
			var sense = {
				//sensor: this.sensors[i].name,
				//temperature: data.temperature.toFixed(1),
				//humidity: data.humidity.toFixed(1),
				sensor: 'test',
				temperature: 43,
				humidity: 73,
				date: new Date()
			};
			sense_data.push(sense);
        }
        
		console.log(sense_data);
        TempHumidityModel.collection.insert(sense_data);
    },
    light: {
		on: function(){
			var pin = 16;
			gpio.setup(pin, gpio.DIR_OUT, function(){
				gpio.write(pin, 1, function(err) {
					//if (err) throw err;
					console.log('Light is On');
				});
			});
		},
		off: function(){
			var pin = 16;
			gpio.setup(pin, gpio.DIR_OUT, function(){
				gpio.write(pin, 0, function(err) {
					//if (err) throw err;
					console.log('Light is Off');
				});
			});
		}
	}
};

module.exports = sensor;
