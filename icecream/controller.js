var utils = require('./utils');
var View = require('./view');
var fs = require('fs');

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

    var ext = this.context.get('defaultEngine');
    var engine = this.context.engines[ext];

    file += '.' + ext;
    if(file.indexOf('/')==0)
        file = this.context.get('appDir')+'/views'+file;
    else
        file = this.context.get('appDir')+'/views'+this.viewDir+'/'+file;
    
    //render body
    var view = this.context.getObject("views", file)
    if(debug || !view){
        log("load view : "+file);
        view = new View();
        this.context.setObject("views", file, view);
    }
    view.render(file, engine, options, callbackForPage);

    //render layout
    options.body = body;
    var layoutFile = this.context.get('appDir')+'/views/layout/'+this.layout+'.'+ext;
    var layoutView = this.context.getObject("views", layoutFile);
    if(debug || !layoutView){
        log("load view : "+'layout/'+this.layout);
        layoutView = new View();
        this.context.setObject("views", layoutFile, layoutView);
    }
    layoutView.render(layoutFile, engine, options,callbackForLayout);
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
