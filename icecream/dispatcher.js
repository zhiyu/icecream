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

    if(this.context.get("static") && this.context.getObject("statics", req.url) && fs.existsSync(this.context.get('staticDir')+this.context.getObject("statics", req.url))){
        fs.readFile(this.context.get('staticDir')+this.context.getObject("statics", req.url), "binary", function(err, data) {
            if (err) {
                console.log(err);
            } else {
                res.write(data, "binary");
            }
            res.end();
        });
    }else{
        if(this.isAction(req)){
            this.doAction(req,res);
        }else{
            this.doResource(req,res);
        }
    }
}

dispatcher.getExt = function(req){
    var url = req.url.indexOf('?')!=-1?req.url.split('?')[0]:req.url;
    return path.extname(url);
}

dispatcher.doAction = function(req,res){
    var errMessage = null;

    //get controller and action name
    var url        = req._parsedUrl.pathname;

    var vpath = this.context.get('vpath');
    if(vpath!='' && url.indexOf(vpath) == 0){
        url = url.substring(vpath.length);
    }

    var route      = this.context.getObject("routes", url);
    if(route){
        url = route;
    }

    var controller = this.getController(req, res, url);
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

    res.setHeader("Content-Type", "text/html; charset=" + this.context.get("encoding"));

    var act = controller.getAction('ACTION', action);
    if(act){
        //beforeFileter
        if(controller.actions.beforeFilter)
          controller.actions.beforeFilter.call(controller);

        //action
        act.call(controller);

        //afterFileter
        if(controller.actions.afterFilter)
            controller.actions.afterFilter.call(controller);
    }else{
        errMessage = 'action "'+ action + '" not exist!';
        res.write(errMessage);
        res.end();
    }
}

dispatcher.doResource = function(req,res){
    var url      = req._parsedUrl.pathname;

    var vpath = this.context.get('vpath');
    if(vpath!='' && url.indexOf(vpath) == 0){
        url = url.substring(vpath.length);
    }

    var ext      = path.extname(url);
    var pathname = this.context.get('appRoot')+"public" + urlHelper.parse(url).pathname;
    var status   = 200;
    var content  = "";
    var contentType = "text/plain";

    if(fs.existsSync(pathname)){

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

dispatcher.getController = function(req, res, url){
    var controller  = null;
    var controllerName  = this.getControllerName(url);
    var relName     = this.getControllerFile(url);
    var absName     = this.context.get('appDir')+'/controllers' + relName;

    if(!fs.existsSync(absName)){
        return null;
    }

    if(this.shouldReloadController(absName)){
        controller = new Controller(req, res);
        controller.controllerName = controllerName;
        controller.viewDir = path.dirname(relName) + "/" + controllerName;
        var content = fs.readFileSync(absName).toString();
        new Function('context', 'require', 'with(context){'+ content + '}')(controller.variables, require);
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
