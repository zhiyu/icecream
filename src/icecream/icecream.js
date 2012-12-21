var path       = require('path');
var urlHelper  = require("url");
var fs         = require('fs');
var connect    = require('connect')
var http       = require('http');
var dispatcher = require('./dispatcher');
var cluster = require('cluster');

var icecream = module.exports = {
    createServer : function(){
        this.engines = {};
        this.config  = {};
        this.caches  = {};    
        this.server  = connect();

        this.engine('jade', require('jade').renderFile);
        this.engine('ejs', require('ejs').renderFile);

        this.set('defaultEngine', 'ejs');
        this.set('appRoot',  __dirname +'/../app');
        this.set('defaultController', 'page');
        this.set('defaultAction',  'index');
        this.set('suffix',  '');

        this.version = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version;
        dispatcher.context = this;
        return this;
    },
    use : function(func){
        this.server.use(func);
        return this;
    },
    listen : function(port){     
        this.server.use(connect.query());
        this.server.use(connect.bodyParser());
        this.server.use(function(req, res){
            dispatcher.dispatch(req, res);
        });

        if (this.get("cluster")==true && cluster.isMaster) {
            console.log("cluster enabled...");
            cluster.on('exit', function(worker, code, signal) {
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
    },
    get : function(key){
        return this.config[key];
    },
    set : function(key,val){
        this.config[key] = val;
    },
    engine : function(ext,engine){
        this.engines[ext] = engine;
    },
    share : function(shareObject){
        this.shareObject = shareObject;
    },
    getObject : function(cache, key){
        if(!this.caches[cache])
            return null;
        return this.caches[cache][key];
    },
    setObject : function(cache, key, object){
        if(!this.caches[cache])
            this.caches[cache] = {};
        this.caches[cache][key] = object;
    }
}