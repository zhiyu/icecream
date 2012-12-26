var path       = require('path');
var urlHelper  = require("url");
var fs         = require('fs');
var connect    = require('connect')
var http       = require('http');
var Dispatcher = require('./dispatcher');
var cluster    = require('cluster');
var utils      = require('./utils');

var icecream = module.exports = {}

icecream.createServer = function(options){
    this.options = options;
    this.init();
    this.server  = connect();
    return this;
}

icecream.init = function(){
    global.icecream = this;
    this.engines = {};
    this.config  = {};
    this.caches  = {}; 

    for(var i in this.options){
        this.set(i, this.options[i]);
    }

    this.set('defaultEngine', 'ejs');
    this.set('sysDir',  __dirname);
    this.set('defaultController', 'page');
    this.set('defaultAction',  'index');
    this.set('defaultLanguage', 'en_US');
    this.set('encoding', 'utf8');
    this.set('suffix',  '');
     
    this.engine('jade', require('jade').renderFile);
    this.engine('ejs', require('ejs').renderFile);
    
    this.version = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version;
    this.dispatcher = new Dispatcher();
}

icecream.use = function(func){
    this.server.use(func);
    return this;
}

icecream.listen = function(port){   
    var self = this;  

    self.loadHelpers();
    self.loadLanguages();

    this.server.use(connect.query());
    this.server.use(connect.bodyParser());
    this.server.use(function(req, res){
        res.setHeader("Content-Type", "text/html; charset=" + self.get("encoding"));
        self.dispatcher.dispatch(req, res); 
    });

    if (this.get("cluster")==true && cluster.isMaster) {
        console.log("cluster enabled...");
        cluster.on('exit', function(worker, code, signal) {
            console.log("helo:"+signal);
            cluster.fork();
        }); 
        var cpus = require('os').cpus().length;
        for (var i = 0; i < cpus; i++) {
           cluster.fork();
        }
    } else {
        this.server.listen(port);
    }
    
    return this;
}

icecream.get = function(key){
    return this.config[key];
}

icecream.set = function(key,val){
    this.config[key] = val;
}

icecream.engine = function(ext,engine){
    this.engines[ext] = engine;
}

icecream.share = function(shareObject){
    this.shareObject = shareObject;
    return this;
}

icecream.global = function(globalObject){
    for(var i in globalObject){
        global[i] = globalObject[i];
    }

    return this;
}

icecream.getObject = function(cache, key){
    if(!this.caches[cache])
        return null;
    return this.caches[cache][key];
}

icecream.setObject = function(cache, key, object){
    if(!this.caches[cache])
        this.caches[cache] = {};
    this.caches[cache][key] = object;
}

icecream.loadHelpers = function(){
    var sysDir = this.get("sysDir")+"/helpers/";
    if (fs.existsSync(sysDir)) {
        fs.readdirSync(sysDir).forEach(function(file) {
            if(path.extname(file) == '.js'){
                var helpers = require(sysDir+file);
                for(var i in helpers){
                    global[i] = helpers[i];
                }
                console.log("load helpers : " + file);
            }            
        });
    }
}

icecream.loadLanguages = function(){
    var self = this;
    var sysDir = this.get("sysDir")+"/languages/";
    if (fs.existsSync(sysDir)) {
        fs.readdirSync(sysDir).forEach(function(file) {
            if(path.extname(file) == '.js'){
                var sysLanguages = require(sysDir+file);
                var file = path.basename(file, ".js");
                self.setObject("languages", file, sysLanguages);
                console.log("load sys languages : " + file);
            }            
        });
    }

    var appDir = this.get("appDir")+"/languages/";
    if (fs.existsSync(appDir)) {
        fs.readdirSync(appDir).forEach(function(file) {
            if(path.extname(file) == '.js'){
                var appLanguages = require(appDir+file);
                var file = path.basename(file, ".js");
                var languages = self.getObject("languages", file);
                console.log(languages);
                utils.merge(languages, appLanguages);

                console.log(languages);
                self.setObject("languages", file, languages);
                console.log("load app languages : " + file);
            }            
        });
    }
}