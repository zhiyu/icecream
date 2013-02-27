/**
 * Copyright (c) 2012, Zhiyu Zheng. All rights reserved.
 * Licensed under the MIT License
 *
 * Hosted On Github :
 * http://github.com/zhiyu/icecream
 *   
 */


var       path = require('path'),
     urlHelper = require("url"),
            fs = require('fs'),
       connect = require('connect'),
          http = require('http'),
       cluster = require('cluster'),
         utils = require('./utils'),
        wrench = require('wrench'),
        logger = require('log4js').getLogger();

var icecream = module.exports = {
    version : JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version
}

/**
 * Create Server
 *
 * @method  createServer
 * @params  {Object}  options  options for icecream
 * @return  {Object}  connect server object 
 */
icecream.createServer = function(options){
    //set global object
    global.icecream = this;
    
    //init icecream
    this.init(options);
    
    //create server
    this.server = connect();
    this.server.use(connect.query());
    this.server.use(connect.bodyParser());

    return this;
}

/**
 * Init default settings
 *
 * @method  init
 * @param   {Object} options options for icecream
 * @return  {void}
 */
icecream.init = function(options){
    //init global variables
    this.engines = {};
    this.config  = {};
    this.caches  = {}; 

    //default settings for icecream
    this.set('defaultEngine', 'ejs');
    this.set('sysDir', __dirname);
    this.set('appDir', path.dirname(process.argv[1])+"/app/");
    this.set('appRoot', path.dirname(process.argv[1])+"/");
    this.set('defaultController', 'page');
    this.set('defaultAction',  'index');
    this.set('defaultLanguage', 'en_US');
    this.set('encoding', 'utf8');
    this.set('suffix',  '');
    
    //user settings for icecream
    for(var i in options){
        this.set(i, options[i]);
    }

    //set template engines
    this.engine('jade', require('jade').renderFile);
    this.engine('ejs', require('ejs').renderFile);

    //load components
    this.loadLibraries();
    this.loadHelpers();
    this.loadLanguages();
}

icecream.use = function(func){
    this.server.use(func);
    return this;
}

icecream.listen = function(port){   
    var self = this;  

    var dispatcher = require('./dispatcher');
    this.server.use(function(req, res){
        dispatcher.dispatch(req, res); 
    });

    //set cluser
    if (this.get("cluster")==true && cluster.isMaster) {
        logger.info("cluster enabled...");
        cluster.on('exit', function(worker, code, signal) {
            cluster.fork();
        }); 
        var cpus = require('os').cpus().length;
        for (var i = 0; i < cpus-1; i++) {
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

/**
 * Get Object From Cache
 *
 * @method getObject
 * 
 * @param  {String}   cache 
 * @param  {String}   key
 * @return {Object}
 */
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

icecream.template = function(type, args){
    if(type === 'app'){
        var parent = process.cwd();
        var name = args.shift();
        wrench.copyDirSyncRecursive(__dirname+"/templates", parent+"/"+name); 
    }
}

icecream.loadLibraries = function(){
    var self = this;
    var sysDir = this.get("sysDir")+"/libraries/";
    if (fs.existsSync(sysDir)) {
        fs.readdirSync(sysDir).forEach(function(file) {
            if(path.extname(file) == '.js'){
                var sysLibrary = require(sysDir+file);
                var file = path.basename(file, ".js");
                self.setObject("libraries", file, sysLibrary);
                logger.info("load sys library : " + file);
            }            
        });
    }

    var appDir = this.get("appDir")+"/libraries/";
    if (fs.existsSync(appDir)) {
        fs.readdirSync(appDir).forEach(function(file) {
            if(path.extname(file) == '.js'){
                var appLibrary = require(appDir+file);
                var file = path.basename(file, ".js");
                self.setObject("libraries", file, appLibrary);
                logger.info("load app library : " + file);
            }            
        });
    }
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
                logger.info("load sys helpers : " + file);
            }            
        });
    }

    var appDir = this.get("appDir")+"/helpers/";
    if (fs.existsSync(appDir)) {
        fs.readdirSync(appDir).forEach(function(file) {
            if(path.extname(file) == '.js'){
                var helpers = require(appDir+file);
                for(var i in helpers){
                    global[i] = helpers[i];
                }
                logger.info("load app helpers : " + file);
            }            
        });
    }
}

/**
 * Load Language Files
 *
 * @method loadLanguages
 *
 * @return {void}
 */
icecream.loadLanguages = function(){
    var self = this;
    var sysDir = this.get("sysDir")+"/languages/";
    if (fs.existsSync(sysDir)) {
        fs.readdirSync(sysDir).forEach(function(file) {
            if(path.extname(file) == '.js'){
                var sysLanguages = require(sysDir+file);
                var file = path.basename(file, ".js");
                self.setObject("languages", file, sysLanguages);
                logger.info("load sys languages : " + file);
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
                utils.merge(languages, appLanguages);
                self.setObject("languages", file, languages);
                logger.info("load app languages : " + file);
            }            
        });
    }
}