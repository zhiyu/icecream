/**
 * Copyright (c) 2012, Zhiyu Zheng. All rights reserved.
 * Licensed under the MIT License
 *
 * Hosted On Github :
 * http://github.com/zhiyu/icecream
 *
 */


var utils = require('./utils');
var fs = require('fs');
var sanitizer = require('sanitizer');

var Controller = module.exports = function(){
    var self = this;
    self.context = icecream;


    self.getAction = function(method, action){
        return self.actions[method][action];
    }

    self.render = function(){

        var body;
        var debug = self.context.get("debug");
        var file;

        var options = {
          title:''
        }

        if(arguments.length > 1 || (arguments.length == 1 && typeof arguments[0] == 'string')){
            file = arguments[0];
        }else{
            file = self.action;
        }

        if(arguments.length > 1){
            utils.merge(options, arguments[1]);
        }else if(arguments.length == 1 && typeof arguments[0] != 'string'){
            utils.merge(options, arguments[0]);
        }

        utils.merge(options, self);

        var callbackForPage = function(arg,content){
            body = content;
            if(arg)
                body = arg.toString();
            else
                body = content;
        }

        var callbackForLayout = function(arg,content){
            if(arg)
                self.send(arg.toString());
            else
                self.send(content);

            if(self.context.get("static")){
                var stc  = self.context.getObject("statics", self.req.url);
                var file = self.context.get('staticDir')+stc;

                if(stc){
                    fs.writeFile(file, content, function (err) {
                       console.log(err);
                    });
                }
            }

        }

        var ext = self.context.get('defaultEngine');
        var engine = self.context.engines[ext];

        file += '.' + ext;
        if(file.indexOf('/')==0)
            file = self.context.get('appDir')+'/views'+file;
        else
            file = self.context.get('appDir')+'/views'+self.viewDir+'/'+file;

        //render body
        engine(file, options, callbackForPage);

        //render layout
        options.body = body;
        var layoutFile = self.context.get('appDir')+'/views/layout/'+self.layout+'.'+ext;
        engine(layoutFile, options,callbackForLayout);
    }

    self.error = function(errorCode){
        var body;
        var debug = self.context.get("debug");
        var file, options;

        if(arguments.length > 1 || (arguments.length == 1 && typeof arguments[0] == 'string')){
            file = arguments[0];
        }else{
            file = self.action;
        }

        if(arguments.length > 1){
            options = arguments[1];
        }else if(arguments.length == 0 || (arguments.length == 1 && typeof arguments[0] == 'string')){
            options = {};
        }else{
            options = arguments[0];
        }

        utils.merge(options, self);

        var callbackForPage = function(arg,content){
            self.res.statusCode = errorCode;
            if(arg)
                self.send(arg.toString());
            else
                self.send(content);
        }

        var ext = self.context.get('defaultEngine');
        var engine = self.context.engines[ext];

        file += '.' + ext;
        file = self.context.get('appDir')+'/views/error/'+file;

        //render body
        engine(file, options, callbackForPage);
    }

    self.redirect = function(url){
        var vpath = self.context.get('vpath');
        if(vpath!='' && url.indexOf("/") == 0){
            url = vpath + url;
        }

        self.res.statusCode = 302;
        self.res.setHeader('Location', url);
        self.res.setHeader('Content-Length', 0);
        self.res.end();
    }

    self.flash = function(url, tourl, data, time){
        var vpath = self.context.get('vpath');
        if(vpath!='' && tourl.indexOf("/") == 0){
            tourl = vpath + tourl;
        }

        if(data == null || data == undefined){
            data = {};
        }

        if(time == null || time == undefined){
            time = 3;
        }

        data['flash_time'] = time;

        self.res.write("<meta http-equiv='refresh' content='"+time+"; url="+tourl+"'>");
        self.render(url, data);
    }

    self.write = function(body){
        self.res.write(body, self.context.get("encoding"));
    }

    self.send = function(body){
        self.res.write(body, self.context.get("encoding"));
        self.res.end();
    }

    self.get = function(key, flag){
        var val = self.req.query[key];
        return flag?sanitizer.escape(val):val;
    }

    self.post = function(key, flag){
        var val = self.req.body[key];
        return flag?sanitizer.escape(val):val;
    }

    self.param = function(key, flag){
        var val = self.req.body[key]?self.req.body[key]:self.req.query[key];
        return flag?sanitizer.escape(val):val;
    }

    self.session = function(key,val){
        if(key==undefined && val==undefined){
            return self.req.session;
        }

        if(!self.req.session){
            return null;
        }

        if(val!==undefined){
            self.req.session[key] = val;
            self.req.session.save();
        }else{
            return self.req.session[key];
        }
    }

    self.actions = {
      GET:{},
      POST:{},
      HEAD:{},
      TRACE:{},
      PUT:{},
      DELETE:{},
      OPTIONS:{},
      CONNECT:{},
      "ACTION":{}
    };

    var variables = {
        self   : this,
        action : function(name, func){
            self.actions['ACTION'][name] = func;
        },
        beforeFilter : function(func){
            self.actions.beforeFilter = func;
        },
        afterFilter : function(func){
            self.actions.afterFilter = func;
        }
    }

    variables.render = self.render;
    variables.error = self.error;
    variables.redirect = self.redirect;
    variables.flash = self.flash;
    variables.write = self.write;
    variables.send = self.send;
    variables.get = self.get;
    variables.post = self.post;
    variables.param = self.param;
    variables.session = self.session;

    self. variables = variables;


    if(self.context.shareObject){
        utils.merge(self, self.context.shareObject);
    }
};
