var path       = require('path');
var urlHelper  = require("url");
var fs         = require('fs');
var connect    = require('connect')
var http       = require('http');
var dispatcher = require('./dispatcher');
var cluster = require('cluster');

var icecream = module.exports = {
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

        this.engines    = {};
        this.config     = {};
        this.viewCaches = {};
        
        //add view engines
        this.engine('jade', require('jade').renderFile);
        this.engine('ejs', require('ejs').renderFile);

        this.set('defaultEngine', 'ejs');
        this.set('appRoot',  __dirname +'/../app');
        this.set('defaultController', 'page');
        this.set('defaultAction',  'index');
        this.set('suffix',  '');

    },
    use : function(func){
        this.server.use(func);
        return this;
    },
    listen : function(port){
        this.server.use(dispatcher.run);
        var cpus = require('os').cpus().length;

        if (cluster.isMaster) {
          for (var i = 0; i < cpus; i++) {
            cluster.fork();
          }
          cluster.on('exit', function(worker, code, signal) {
            cluster.fork();
          });
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
    }
}

icecream.version = JSON.parse( fs.readFileSync( __dirname + '/../package.json', 'utf8' )).version;
