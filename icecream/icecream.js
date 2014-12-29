/**
 * Copyright (c) 2012, Zhiyu Zheng. All rights reserved.
 * Licensed under the MIT License
 *
 * Hosted On Github :
 * http://github.com/zhiyu/icecream
 *   
 */

var path = require('path');
var urlHelper = require("url");
var fs = require('fs');
var connect = require('connect');
var http = require('http');
var cluster = require('cluster');
var utils = require('./utils');
var wrench = require('wrench');
var logger = require('log4js').getLogger();

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

    this.server.use(function(req, res, next) {
      req.rawBody = '';
      req.on('data', function(chunk) { 
        req.rawBody += chunk;
      });
      next();
    });

    var getRawBody = require('raw-body');
    var typer      = require('media-typer');

    this.server.use(function (req, res, next) {
      getRawBody(req, {
        length: req.headers['content-length'],
        limit: '2mb',
        encoding: typer.parse(req.headers['content-type']).parameters.charset
      }, function (err, string) {
        if (err)
          return next(err);
        req.text = string;
        next();
      });
    });

    this.server.use(connect.bodyParser());
    
    if(options && options.key && options.cert){
        var https = require('https');
        this.httpsServer = https.createServer(options, this.server);
    }
    
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

    var root = path.dirname(path.dirname(path.dirname(path.dirname(__filename))));
    this.set('defaultEngine', 'ejs');
    this.set('sysDir', __dirname);
    this.set('appRoot', root + "/");
    this.set('appDir',  root + "/app/");
    this.set('staticDir', root + "/static/");
    this.set('vpath', "");
    this.set('defaultController', 'page');
    this.set('defaultAction',  'index');
    this.set('defaultLanguage', 'en_US');
    this.set('encoding', 'utf-8');
    this.set('suffix',  '');
    this.set('debug',  true);
    this.set('static', false);
    
    //user settings for icecream
    for(var i in options){
        this.set(i, options[i]);
    }

    //set template engines
    this.engine('ejs', require('ejs').renderFile);

    //load components
    this.loadLibraries();
    this.loadHelpers();
    this.loadLanguages();
    this.loadRoutes();
    this.loadStatics();
}

icecream.use = function(func){
    this.server.use(func);
    return this;
}

icecream.listen = function(port, host, backlog, callback){   
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
        if(this.httpsServer){
            this.httpsServer.listen(port, host, backlog, callback);   
        }else{
            this.server.listen(port, host, backlog, callback);
        }
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

/**
 * Set Cache
 *
 * @method getObject
 * 
 * @param  {String}   cache 
 * @param  {String}   key
 * @return {Object}
 */
icecream.setObject = function(cache, key, object){
    if(!this.caches[cache])
        this.caches[cache] = {};
    this.caches[cache][key] = object;
}

/**
 * Load libraries 
 *
 * @method loadLibraries
 *
 * @return {void}
 */
icecream.loadLibraries = function(){
    var self = this;
    var dirs = [
      {
        path : this.get("sysDir")+"/libraries/",
        info : 'load sys library'
      },
      {
        path : this.get("appDir")+"/libraries/",
        info : 'load app library'
      }
    ];

    dirs.forEach(function(dir){
        utils.loadFiles(dir.path, function(file, obj){
            self.setObject("libraries", file, obj);
            logger.info(dir.info +':'+ file);
        });
    });
}

/**
 * Load helpers 
 *
 * @method loadHelpers
 *
 * @return {void}
 */
icecream.loadHelpers = function(){
    var self = this;
    var dirs = [
      {
        path : this.get("sysDir")+"/helpers/",
        info : 'load sys helpers'
      },
      {
        path : this.get("appDir")+"/helpers/",
        info : 'load app helpers'
      }
    ];
    
    dirs.forEach(function(dir){
        utils.loadFiles(dir.path, function(file, obj){
            for(var i in obj){
                global[i] = obj[i];
            }
            logger.info(dir.info +':'+ file);
        });
    });
}

/**
 * Load languages
 *
 * @method loadLanguages
 *
 * @return {void}
 */
icecream.loadLanguages = function(){
    var self = this;
    var dirs = [
      {
        path : this.get("sysDir")+"/languages/",
        info : 'load sys languages'
      },
      {
        path : this.get("appDir")+"/languages/",
        info : 'load app languages'
      }
    ];
    
    dirs.forEach(function(dir){
        utils.loadFiles(dir.path, function(file, obj){
            self.setObject("languages", file, obj);
            logger.info(dir.info +':'+ file);
        });
    });
}

/**
 * Load Routes
 *
 * @method loadRoutes
 *
 * @return {void}
 */
icecream.loadRoutes = function(){
    var self   = this;
    var route  = this.get("appDir")+"/config/route.js";
    if(fs.existsSync(route)){
        var routes = require(route);
        for(var i in routes){
            self.setObject("routes", i, routes[i]);   
        }

        logger.info('load app routes:'+ route);
    }
}

/**
 * Load Statics
 *
 * @method loadStatics
 *
 * @return {void}
 */
icecream.loadStatics = function(){
    var self   = this;
    var stc  = this.get("appDir")+"/config/static.js";
    if(fs.existsSync(stc)){
        var stcs = require(stc);
        for(var i in stcs){
            self.setObject("statics", i, stcs[i]);   
        }

        logger.info('load app statics:'+ stc);
    }
}
