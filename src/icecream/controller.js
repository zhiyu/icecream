var utils = require('./utils');
var View = require('./view');
var fs = require('fs');

var Controller = module.exports = function(controller){
    this.context = icecream;
    if(this.context.shareObject){
        utils.merge(this, this.context.shareObject);
    }
};

var prototype = Controller.prototype;

prototype.render = function(file, options){    
    var self = this;
    var body;
    var debug = this.context.get("debug");

    //set defaults
    if(!options)
        options = {};

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
    }
    
    //render body
    var view = this.context.getObject("views", file)
    if(debug || !view){
        log("load view : "+file);
        view = new View(file,this.context);
        this.context.setObject("views", file, view);
    }
    view.render(options,callbackForPage);

    //render layout
    options.body = body;
    var layoutView = this.context.getObject("views", 'layout/'+this.layout);
    if(debug || !layoutView){
        log("load view : "+'layout/'+this.layout);
        layoutView = new View('layout/'+this.layout,this.context);
        this.context.setObject("views", 'layout/'+this.layout, layoutView);
    }
    layoutView.render(options,callbackForLayout);
}

prototype.redirect = function(url){
    this.res.statusCode = 302;
    this.res.setHeader('Location', url);
    this.res.setHeader('Content-Length', 0);
    this.res.end();
}

prototype.write = function(body){
    this.res.write(body, this.context.get("encoding"));
}

prototype.send = function(body){
    this.res.write(body, this.context.get("encoding"));
    this.res.end();
}

prototype.get = function(key){
    return this.req.query[key];
}

prototype.post = function(key){
    return this.req.body[key];
}

prototype.session = function(key,val){
    if(val!==undefined){
        this.req.session[key] = val;
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


prototype.load = function(file, options){
    var Library = this.context.getObject("libraries", file);
    if(Library){
        return new Library(options);
    }
}
