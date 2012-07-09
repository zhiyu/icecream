var path       = require('path');
var urlHelper  = require("url");
var fs         = require('fs');
var connect    = require('connect')
var http       = require('http');
var config     = require("./config");
var View       = require('./view');
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
        this.layout = "layout";

        //add jade engine
        this.engine('jade', require('jade').renderFile);
        this.engine('ejs', require('ejs').renderFile);
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
    },
    
    render : function(file,options,callback){
        var view = this.viewCaches[file];
        if(!view){
            view = new View(file,this);
        }
        view.render(options,callback);
    }
}

//addtions to prototype
require('./request');
require('./response');

var res  = http.ServerResponse.prototype;
res.render = function(file,options,callback){    
    var self = this;
    var body;
    if(!callback){
        callback = function(arg,content){
            body = content;
        }
    }
    icecream.render(file,options,callback);
    options.body = body;

    callback = function(arg,content){
        self.send(content);
    }
    icecream.render(icecream.layout,options,callback);
}
