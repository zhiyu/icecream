var path       = require('path');
var urlHelper  = require("url");
var http       = require('http');
var fs         = require('fs');
var mysql      = require('mysql');
var mime       = require("./mime");
var config     = require("./config");
var ctrl       = require("./controller");

function log(message){
    console.log(message);
}

module.exports = {

    dispatch : function(request,response){
        var url        = request.url;
        var ext        = path.extname(url);

        if(ext == config.suffix){
            this.doAction(request,response);
        }else{
            this.doResource(request,response);
        }
    },

    doAction:function(request,response){
        var url        = request.url;

        if(url.indexOf('?')!=-1){
           url = url.substr(0,url.indexOf('?'));
        }

        var controller = this.getController(url);
        var action     = this.getAction(url);

        if(controller != null){
            if(controller[action] != null){
                controller[action](request,response);
            }else{
                log('method "'+ action + '" not exist!');
                response.end();
            }
        }
    },

    doResource:function(request,response){
        var url      = request.url;
        var ext        = path.extname(url);
        var pathname = './app' + urlHelper.parse(url).pathname;

        if(path.existsSync(pathname)){
            fs.readFile(pathname, "binary", function(err, file) {
                    if (err) {
                        response.writeHead(500, {'Content-Type': 'text/plain'});
                        response.end(err);
                    } else {
                        var contentType = mime[ext] || "text/plain";
                        response.writeHead(200, {'Content-Type': contentType });
                        response.write(file, "binary");
                        response.end();
                    }
            });
        }else{
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write("Page not found!");
            response.end();
        }
    },

    getController:function(url){
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
            controllerObj = require('.' + controller);
        }else{
            log('controller "' + controller + '" not exist!');
        }

        for(var i in controllerObj){
            ctrl[i] = controllerObj[i];
        }
        return ctrl;
    },

    getAction:function(url){
        var action = config.defaultAction;
        if(url == '/'){
            action = config.defaultAction;
        }else if(url.lastIndexOf("/") != (url.length-1)){
            action = path.basename(url);
        }

        return action;
    }
}
