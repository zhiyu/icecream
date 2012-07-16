var path       = require('path');
var urlHelper  = require("url");
var fs         = require('fs');
var connect    = require('connect');
var http       = require('http');
var config     = require('./config');
var Controller = require('./controller');
var utils      = require('./utils');

//mimes
var mime       = {
    ".css" : "text/css",
    ".gif" : "image/gif",
    ".html": "text/html",
    ".ico" : "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg" : "image/jpeg",
    ".js"  : "text/javascript",
    ".json": "application/json",
    ".pdf" : "application/pdf",
    ".png" : "image/png",
    ".svg" : "image/svg+xml",
    ".swf" : "application/x-shockwave-flash",
    ".tiff": "image/tiff",
    ".txt" : "text/plain",
    ".wav" : "audio/x-wav",
    ".wma" : "audio/x-ms-wma",
    ".wmv" : "video/x-ms-wmv",
    ".xml" : "text/xml"
};

//log helper function
function log(message){
    console.log(message);
}

//icecream exports
var dispatcher = module.exports = {
    context:null,
    run : function(req,res){
        var url        = req.url;
        var ext        = path.extname(url);

        if(ext == config.suffix){
            dispatcher.doAction(req,res);
        }else{
            dispatcher.doResource(req,res);
        }
    },
    doAction : function(req,res){
        //parse url
        var url        = req._parsedUrl.pathname;

        //get controller
        var controller = this.getController(url);
        utils.merge(controller,Controller);

        //get action
        var action     = this.getAction(url);

        //call action
        if(controller != null){
            controller.context = this.context;
            controller.req    = req;
            controller.res    = res;
            controller.layout = 'layout';
            controller.uri    = req._parsedUrl.pathname;
            controller.query  = req._parsedUrl.query;
            controller.search = req._parsedUrl.search;
            controller.url    = req.url;
            
            
            try{
                //call 'beforeAction' filter
                if(controller['beforeAction'])
                    controller['beforeAction']();

                //call action
                if(controller[action] != null){
                    controller[action].call(controller);
                }else{
                    log('method "'+ action + '" not exist!');
                    res.write('method "'+ action + '" not exist!');
                    res.end();
                }
            }catch(err){
                res.write(err.toString());
                res.end();
            }
        }else{
            res.write('controller not exist!');
                    res.end();
        }
    },
    doResource : function(req,res){
        var url      = req.url;
        var ext      = path.extname(url);
        var pathname = this.context.get('appRoot') + urlHelper.parse(url).pathname;

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
        
        var controllerRoot = this.context.get('appRoot')+'/controllers';

        if(url == '/'){
            controller   = controllerRoot+ '/' + config.defaultController;
        }else if(url.lastIndexOf("/") == (url.length-1)){
            controller   = controllerRoot + url.substr(0,url.length-1);
        }else{
            if(path.dirname(url) == '/')
                controller = controllerRoot+'/' + config.defaultController;
            else
                controller = controllerRoot + path.dirname(url);
        }

        if(path.existsSync(controller + '.js')){
            if(this.context.get('debug')==true)
                delete require.cache[require.resolve(controller)];
            controllerObj = require(controller);
        }else{
            log('controller "' + controller + '" not exist!');
        }
        return controllerObj;
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