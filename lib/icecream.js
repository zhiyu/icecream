var path       = require('path');
var urlHelper  = require("url");
var fs         = require('fs');
var mime       = require("./mime");
var config     = require("./config");
var ctrl       = require("./controller");
var connect    = require('connect')
var http       = require('http');


require('./response');


function log(message){
    console.log(message);
}

var icecream = module.exports = {
    createServer : function(){
        icecream.init();

        return connect()
          .use(connect.favicon())
          .use(connect.logger('dev'))
          .use(connect.static('public'))
          .use(connect.directory('public'))
          .use(connect.cookieParser())
          .use(connect.session({ secret:'my secret here'}))
          .use(icecream.dispatch);
    },
    listen:function(port){
        this.listen(3000);
    },
    init :function(){
    },
    dispatch : function(req,res){
        var url        = req.url;
        var ext        = path.extname(url);

        if(ext == config.suffix){
            icecream.doAction(req,res);
        }else{
            icecream.doResource(req,res);
        }
    },
    doAction:function(req,res){
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
    doResource:function(req,res){
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
