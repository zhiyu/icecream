var client     = require('mysql');
var databases  = require('./database');
var model = {
    getConnection:function(){
        var connection = client.createConnection(databases['product']);
    	return connection;
    }
}

module.exports = model