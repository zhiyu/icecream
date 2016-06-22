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
    this.context = icecream;
    if(this.context.shareObject){
        utils.merge(this, this.context.shareObject);
    }
};

var prototype = Controller.prototype;

prototype.render = function(){

    var self = this;
    var body;
    var debug = this.context.get("debug");
    var file;

    var options = {
      title:''
    }

    if(arguments.length > 1 || (arguments.length == 1 && typeof arguments[0] == 'string')){
        file = arguments[0];
    }else{
        file = this.action;
    }

    if(arguments.length > 1){
        utils.merge(arguments[1], options);
    }else if(arguments.length == 1 && typeof arguments[0] != 'string'){
        utils.merge(arguments[0], options);
    }

    utils.merge(options, this);

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

    var ext = this.context.get('defaultEngine');
    var engine = this.context.engines[ext];

    file += '.' + ext;
    if(file.indexOf('/')==0)
        file = this.context.get('appDir')+'/views'+file;
    else
        file = this.context.get('appDir')+'/views'+this.viewDir+'/'+file;

    //render body
    engine(file, options, callbackForPage);

    //render layout
    options.body = body;
    var layoutFile = this.context.get('appDir')+'/views/layout/'+this.layout+'.'+ext;
    engine(layoutFile, options,callbackForLayout);
}

prototype.error = function(errorCode){
    var self = this;
    var body;
    var debug = this.context.get("debug");
    var file, options;

    if(arguments.length > 1 || (arguments.length == 1 && typeof arguments[0] == 'string')){
        file = arguments[0];
    }else{
        file = this.action;
    }

    if(arguments.length > 1){
        options = arguments[1];
    }else if(arguments.length == 0 || (arguments.length == 1 && typeof arguments[0] == 'string')){
        options = {};
    }else{
        options = arguments[0];
    }

    utils.merge(options, this);

    var callbackForPage = function(arg,content){
        self.res.statusCode = errorCode;
        if(arg)
            self.send(arg.toString());
        else
            self.send(content);
    }

    var ext = this.context.get('defaultEngine');
    var engine = this.context.engines[ext];

    file += '.' + ext;
    file = this.context.get('appDir')+'/views/error/'+file;

    //render body
    engine(file, options, callbackForPage);
}

prototype.redirect = function(url){

    var vpath = this.context.get('vpath');
    if(vpath!='' && url.indexOf("/") == 0){
        url = vpath + url;
    }

    this.res.statusCode = 302;
    this.res.setHeader('Location', url);
    this.res.setHeader('Content-Length', 0);
    this.res.end();
}

prototype.flash = function(url, tourl, data, time){

    var vpath = this.context.get('vpath');
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

    this.res.write("<meta http-equiv='refresh' content='"+time+"; url="+tourl+"'>");
    this.render(url, data);
}

prototype.write = function(body){
    this.res.write(body, this.context.get("encoding"));
}

prototype.send = function(body){
    this.res.write(body, this.context.get("encoding"));
    this.res.end();
}

prototype.get = function(key, flag){
    var val = this.req.query[key];
    return flag?sanitizer.escape(val):val;
}

prototype.post = function(key, flag){
    var val = this.req.body[key];
    return flag?sanitizer.escape(val):val;
}

prototype.param = function(key, flag){
    var val = this.req.body[key]?this.req.body[key]:this.req.query[key];
    return flag?sanitizer.escape(val):val;
}

prototype.session = function(key,val){
    if(key==undefined && val==undefined){
        return this.req.session;
    }

    if(!this.req.session){
        return null;
    }

    if(val!==undefined){
        this.req.session[key] = val;
        this.req.session.save();
    }else{
        return this.req.session[key];
    }
}

prototype.action = function(name, func){
    this[name] = func;
}

prototype.beforeFilter = function(func){
    this.beforeFilter = func;
}

prototype.afterFilter = function(func){
    this.afterFilter = func;
}
