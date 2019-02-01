var mongoose = require('mongoose');

var dbOpties = { 
	dbName: "blockchain",
	reconnectTries: Number.MAX_VALUE
} // dbName moet ivm connectie met +srv voor gebruik met Compass DB

var db = mongoose.connect('mongodb+srv://blockchain_admin_test:12345@cluster0-pd97m.mongodb.net', dbOpties, function(){
	console.log('Connected via Mongoose');
});
module.exports = db;