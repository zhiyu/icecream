/**
 * Copyright (c) 2012, Zhiyu Zheng. All rights reserved.
 * Licensed under the MIT License
 *
 * Hosted On Github :
 * http://github.com/zhiyu/icecream
 *   
 */


var path       = require('path');
var urlHelper  = require("url");
var fs         = require('fs');
var Controller = require('./controller');
var mime       = require('./mimes');
var utils      = require('./utils');

var dispatcher = module.exports = {
    context : icecream
}

dispatcher.dispatch = function(req, res){
    if(this.isAction(req)){
        this.doAction(req,res);
    }else{
        this.doResource(req,res);
    }
}

dispatcher.getExt = function(req){
    var url = req.url.indexOf('?')!=-1?req.url.split('?')[0]:req.url;
    return path.extname(url);
}

dispatcher.doAction = function(req,res){
    res.setHeader("Content-Type", "text/html; charset=" + this.context.get("encoding"));
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
    controller.action  = action;

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

dispatcher.doResource = function(req,res){
    var url      = req.url;
    var ext      = path.extname(url);
    var pathname = this.context.get('appRoot')+"public" + urlHelper.parse(url).pathname;
    var status   = 200;
    var content  = "";
    var contentType = "text/plain";

    if(path.existsSync(pathname)){

        fs.stat(pathname, function (err, stat) {

            var lastModified = stat.mtime.toUTCString();
            
            if (req.headers['if-modified-since'] && lastModified == req.headers['if-modified-since']) {
                res.writeHead(304, "Not Modified");
                res.end();
            } else {
                fs.readFile(pathname, "binary", function(err, data) {
                    if (err) {
                        status = 500;
                        content = err;
                    } else {
                        content = data;
                        contentType = mime[ext] || contentType;
                    }
                    
                    res.writeHead(status, {'Last-Modified':lastModified,'Content-Type': contentType });
                    res.write(content, "binary");
                    res.end();
                });
            }

        });

    }else{
        res.writeHead(404, {'Content-Type': "text/plain"});
        res.write("Resource not found!");
        res.end();
    }
}

dispatcher.getController = function(url){
    var controller  = null;
    var controllerName  = this.getControllerName(url);
    var relName     = this.getControllerFile(url);
    var absName     = this.context.get('appDir')+'/controllers' + relName;
    
    if(!path.existsSync(absName)){
        return null;
    }

    if(this.shouldReloadController(absName)){
        controller = new Controller();
        controller.controllerName = controllerName;
        controller.viewDir = path.dirname(relName) + "/" + controllerName;
        var content = fs.readFileSync(absName).toString();
        new Function('context', 'require','with(context){'+ content + '}')(controller,require);
        this.context.setObject("controllers", absName, controller);
    }else{
        controller = this.context.getObject("controllers", absName);
    }

    return controller;
}

dispatcher.getControllerName = function(url){
    var name;
    if(this.isDefaultController(url)){
        name = this.context.get('defaultController');
    }else if(url.lastIndexOf("/") == (url.length-1)){
        name = url.substr(0,url.length-1);
    }else{
        name = url.substr(0,url.lastIndexOf("/"));
    }
    return path.basename(name);
}

dispatcher.getControllerFile = function(url){
    var file;
    if(this.isDefaultController(url)){
        file = '/' + this.context.get('defaultController');
    }else if(url.lastIndexOf("/") == (url.length-1)){
        file = url.substr(0,url.length-1);
    }else{
        file = path.dirname(url);
    }
    return file + '.js';
}

dispatcher.getAction = function(url){
    var action = this.context.get('defaultAction');
    if(url.lastIndexOf("/") != (url.length-1)){
        action = path.basename(url);
    }
    return action;
}

dispatcher.isAction = function(req){
    var ext = this.getExt(req);
    return ext == this.context.get('suffix');
}

dispatcher.isDefaultController = function(url){
    return url.lastIndexOf('/')==0;
}

dispatcher.shouldReloadController = function(file){
    return this.context.get('debug')==true || this.context.getObject("controllers", file) == undefined;
}