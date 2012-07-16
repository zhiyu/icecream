var path       = require('path');
var urlHelper  = require("url");
var fs         = require('fs');
var connect    = require('connect')
var http       = require('http');
var config     = require("./config");
var dispatcher = require('./dispatcher');

//icecream exports
var icecream = module.exports = {
    //Server
    createServer : function(){
        dispatcher.context = this;
        this.server = connect();
        this.init();
        return this;
    },
    init : function(){
        this.server.use(connect.query());
        this.server.use(connect.bodyParser());
        this.server.use(connect.cookieParser());
        icecream.use(connect.session({ secret:'DFJLK8DFGJ933JKLFGJ2'}));

        this.engines    = {};
        this.config     = {};
        this.viewCaches = {};
        
        //add jade engine
        this.engine('jade', require('jade').renderFile);
        this.engine('ejs', require('ejs').renderFile);

        this.set('defaultEngine', 'jade');
        this.set('appRoot',  __dirname +'/../app');
    },
    use : function(func){
        this.server.use(func);
        return this;
    },
    listen : function(port){
        this.server.use(dispatcher.run);
        this.server.listen(port);
        return this;
    },
    //Configurations
    get : function(key){
        return this.config[key];
    },
    set : function(key,val){
        this.config[key] = val;
    },
    engine : function(ext,engine){
        this.engines[ext] = engine;
    }
}
