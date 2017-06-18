var mongoose = require("mongoose");

//	DB Connection
function mongooseConnect () {
	mongoose.connect('mongodb://neeraj:polyhouse@ds064799.mlab.com:64799/polyhouse',
	{ server: { reconnectTries: Number.MAX_VALUE } },
	function(err){
		if (err){
			setTimeout(function(){
				mongooseReconnect();
			}, 5000);
		}
	});
}

function mongooseReconnect(){
	mongoose.connection.close();
	mongooseConnect();
}

mongoose.connection.on('connected', function() {
	console.log('MongoDB Connected');
});

mongoose.connection.on('reconnect', function() {
	console.log('reconnecting...');
	mongooseReconnect();
});

mongoose.connection.on('err', function() {
	mongooseReconnect();
});

mongooseConnect();
