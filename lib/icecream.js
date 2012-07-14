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
        this.init();

        dispatcher.context = this;
        //this.server = http.createServer(dispatcher.run);
        this.server = connect();
        return this;
    },
    init : function(){
        this.engines    = {};
        this.config     = {};
        this.viewCaches = {};

        //add jade engine
        this.engine('jade', require('jade').renderFile);
        this.engine('ejs', require('ejs').renderFile);
    },
    use : function(func){
        this.server.use(func);
        return this;
    },
    listen : function(port){
        var cluster = require('cluster');
        this.server.use(dispatcher.run);
        cluster(this.server).listen(port);
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

//addtions to prototype
require('./request');
require('./response');
