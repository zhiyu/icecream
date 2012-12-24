var path       = require('path');
var urlHelper  = require("url");
var fs         = require('fs');
var Controller = require('./controller');
var mime       = require('./mimes');
var utils      = require('./utils');

var Dispatcher = module.exports = function Dispatcher(context){
    this.context = context;
}

var prototype = Dispatcher.prototype;

prototype.dispatch = function(req, res){
    if(this.isAction(req)){
        this.doAction(req,res);
    }else{
        this.doResource(req,res);
    }
}

prototype.getExt = function(req){
    var url = req.url.indexOf('?')!=-1?req.url.split('?')[0]:req.url;
    return path.extname(url);
}

prototype.doAction = function(req,res){
    var errMessage = null;

    //get controller and action name
    var url        = req._parsedUrl.pathname;
    var controller = this.getController(url);
    var action     = this.getAction(url);
    
    //if no controller
    if(controller == null){
        errMessage = 'controller not exist!';
        res.write(errMessage);
        res.end();
        return;
    }
    
    //set variables
    controller.context = this.context;
    controller.req     = req;
    controller.res     = res;
    controller.layout  = 'layout';
    controller.uri     = req._parsedUrl.pathname;
    controller.query   = req._parsedUrl.query;
    controller.search  = req._parsedUrl.search;
    controller.url     = req.url;

    if(controller[action]){
        //beforeFileter
        if(controller['beforeFilter'])
            controller['beforeFilter']();

        //action
        controller[action].call(controller);

        //afterFileter
        if(controller['afterFilter'])
            controller['afterFilter']();
    }else{
        errMessage = 'action "'+ action + '" not exist!';
        res.write(errMessage);
        res.end();
    }
}

prototype.doResource = function(req,res){
    var url      = req.url;
    var ext      = path.extname(url);
    var pathname = this.context.get('appRoot') + urlHelper.parse(url).pathname;
    var status   = 200;
    var content  = "";
    var contentType = "text/plain";

    if(path.existsSync(pathname)){
        fs.readFile(pathname, "binary", function(err, data) {
            if (err) {
                status = 500;
                content = err;
            } else {
                content = data;
                contentType = mime[ext] || contentType;
            }
            res.writeHead(status, {'Content-Type': contentType });
            res.write(content, "binary");
            res.end();
        });
    }else{
        res.writeHead(404, {'Content-Type': "text/plain"});
        res.write("Resource not found!");
        res.end();
    }
}

prototype.getController = function(url){
    var controller  = {};
    var file        = this.getControllerFile(url);

    if(!path.existsSync(file)){
        return null;
    }

    if(this.shouldReloadController(file)){
        utils.merge(controller,Controller);
        var content = fs.readFileSync(file).toString();
        new Function('context', 'require','with(context){'+ content + '}')(controller);
        if(this.context.shareObject){
            for(var i in this.context.shareObject){
                controller[i] = this.context.shareObject[i];
            }
        }
        this.context.setObject("controllers", file, controller);
    }else{
        controller = this.context.getObject("controllers", file);
    }
    
    return controller;
}

prototype.getControllerFile = function(url){
    var file;
    var controllerRoot = this.context.get('appRoot')+'/controllers';
    if(this.isDefaultController(url)){
        file = controllerRoot+ '/' + this.context.get('defaultController');
    }else if(url.lastIndexOf("/") == (url.length-1)){
        file = controllerRoot + url.substr(0,url.length-1);
    }else{
        file = controllerRoot + path.dirname(url);
    }
    return file + '.js';
}

prototype.getAction = function(url){
    var action = this.context.get('defaultAction');
    if(url.lastIndexOf("/") != (url.length-1)){
        action = path.basename(url);
    }
    return action;
}

prototype.isAction = function(req){
    var ext = this.getExt(req);
    return ext == this.context.get('suffix');
}

prototype.isDefaultController = function(url){
    return url == '/' || path.dirname(url) == '/';
}

prototype.shouldReloadController = function(file){
    return this.context.get('debug')==true || this.context.getObject("controllers", file) == undefined;
}
