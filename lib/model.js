var mysql      = require('mysql');
var databases  = require('./database');

var model = {
    clients:{},
    init:function(){
        for(var config in databases){
            this.clients[config] = this.createClient(databases[config]);
        }
    },
    createClient:function(option){
    	var db = mysql.createClient(option);
    	return db;
    },
    getModel:function(config){
    	return this.clients[config];
    }
}

model.init();
module.exports = model