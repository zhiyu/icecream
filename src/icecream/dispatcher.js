var path       = require('path');
var urlHelper  = require("url");
var fs         = require('fs');
var Controller = require('./controller');
var mime       = require('./mimes');

function Dispatcher(context){
    this.context = context;
}

Dispatcher.prototype = {
    context:null,
    dispatch : function(req, res){
        var url = req.url.indexOf('?')!=-1?req.url.split('?')[0]:req.url;
        var ext        = path.extname(url);

        if(ext.indexOf("&")!=-1 || ext == this.context.get('suffix')){
            this.doAction(req,res);
        }else{
            this.doResource(req,res);
        }

    },
    doAction : function(req,res){
        var url        = req._parsedUrl.pathname;
        var controller = this.getController(url);
        var action     = this.getAction(url);

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
                if(controller['beforeFilter'])
                    controller['beforeFilter']();
                if(controller[action] != null){
                    controller[action].call(controller);
                }else{
                    console.log('method "'+ action + '" not exist!');
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
        var content = null;
        var controller = {};
        var controllerFile = '';
        var controllerRoot = this.context.get('appRoot')+'/controllers';

        if(url == '/'){
            controllerFile   = controllerRoot+ '/' + this.context.get('defaultController');
        }else if(url.lastIndexOf("/") == (url.length-1)){
            controllerFile   = controllerRoot + url.substr(0,url.length-1);
        }else{
            if(path.dirname(url) == '/')
                controllerFile = controllerRoot+'/' + this.context.get('defaultController');
            else
                controllerFile = controllerRoot + path.dirname(url);
        }

        if(path.existsSync(controllerFile + '.js')){
            if(this.context.get('debug')==true || this.context.getObject("controllers", controllerFile)==undefined){
                this.merge(controller,Controller);
                content = this.read(controllerFile + '.js');
                var fun = new Function('context', 'require','with(context){'+ content + '}');
                fun(controller);
                if(this.context.shareObject){
                    for(var i in this.context.shareObject){
                        controller[i] = this.context.shareObject[i];
                    }
                }
                this.context.setObject("controllers", controllerFile, controller);
            }else{
                controller = this.context.getObject("controllers", controllerFile);
            }
        }else{
            console.log('controller "' + controllerFile + '" not exist!');
        }
        return controller;
    },
    getAction : function(url){
        var action = this.context.get('defaultAction');
        if(url.lastIndexOf("/") != (url.length-1)){
            action = path.basename(url);
        }
        return action;
    },
    merge : function(a,b){
        if (a && b) {
            for (var key in b) {
              a[key] = b[key];
            }
        }
        return a;
    },
    read : function(file){
        return fs.readFileSync(file).toString();
    }
}

module.exports = Dispatcher;
