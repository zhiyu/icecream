var path       = require('path');
var urlHelper  = require("url");
var fs         = require('fs');
var connect    = require('connect')
var http       = require('http');
var config     = require("./config");
var ctrl       = require("./controller");
var View       = require('./view');
//mimes
var mime       = {
  "css" : "text/css",
  "gif" : "image/gif",
  "html": "text/html",
  "ico" : "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg" : "image/jpeg",
  "js"  : "text/javascript",
  "json": "application/json",
  "pdf" : "application/pdf",
  "png" : "image/png",
  "svg" : "image/svg+xml",
  "swf" : "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt" : "text/plain",
  "wav" : "audio/x-wav",
  "wma" : "audio/x-ms-wma",
  "wmv" : "video/x-ms-wmv",
  "xml" : "text/xml"
};

//log helper function
function log(message){
    console.log(message);
}

//icecream exports
var app = module.exports = {
    //Server
    createServer : function(){
        this.init();
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
        this.server.use(this.dispatch);
        this.server.listen(3000);
        return this;
    },

    //Configurations
    get : function(key){
        return this.config[key];
    },
    set : function(key,val){
        this.config[key] = val;
    },

    //Render
    engine : function(ext,engine){
        this.engines[ext] = engine;
    },
    
    render : function(file,options,callback){
        var view = this.viewCaches[file];
        if(!view){
            view = new View(file,this);
        }
        view.render(options,callback);
    },

    //MVC
    dispatch : function(req,res){
        var url        = req.url;
        var ext        = path.extname(url);

        if(ext == config.suffix){
            app.doAction(req,res);
        }else{
            app.doResource(req,res);
        }
    },
    doAction : function(req,res){
        var url        = req.url;

        if(url.indexOf('?')!=-1){
           url = url.substr(0,url.indexOf('?'));
        }

        var controller = this.getController(url);
        var action     = this.getAction(url);

        if(controller != null){
            if(controller[action] != null){
                controller[action](req,res);
            }else{
                log('method "'+ action + '" not exist!');
                res.end();
            }
        }
    },
    doResource : function(req,res){
        var url      = req.url;
        var ext      = path.extname(url);
        var pathname = './app' + urlHelper.parse(url).pathname;

        if(path.existsSync(pathname)){
            fs.readFile(pathname, "binary", function(err, file) {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end(err);
                    } else {
                        var contentType = mime[ext] || "text/plain";
                        res.writeHead(200, {'Content-Type': contentType });
                        res.write(file, "binary");
                        res.end();
                    }
            });
        }else{
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write("Page not found!");
            res.end();
        }
    },
    getController : function(url){
        var controllerObj = null;
        var controller = '';
        
        if(url == '/'){
            controller   = './app/controllers/' + config.defaultController;
        }else if(url.lastIndexOf("/") == (url.length-1)){
            controller   = './app/controllers' + url.substr(0,url.length-1);
        }else{
            if(path.dirname(url) == '/')
                controller = './app/controllers/' + config.defaultController;
            else
                controller = './app/controllers' + path.dirname(url);
        }

        if(path.existsSync(controller + '.js')){
            if(this.get('debug')==true)
                delete require.cache[require.resolve('.' + controller)];
            controllerObj = require('.' + controller);
        }else{
            log('controller "' + controller + '" not exist!');
        }

        for(var i in controllerObj){
            ctrl[i] = controllerObj[i];
        }
        return ctrl;
    },
    getAction : function(url){
        var action = config.defaultAction;
        if(url == '/'){
            action = config.defaultAction;
        }else if(url.lastIndexOf("/") != (url.length-1)){
            action = path.basename(url);
        }

        return action;
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
    app.render(file,options,callback);
    options.body = body;

    callback = function(arg,content){
        self.send(content);
    }
    app.render(app.layout,options,callback);
}
