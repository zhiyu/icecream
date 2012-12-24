var View       = require('./view');
var Controller = module.exports;

Controller.render = function(file, options){    
    var self = this;
    var body;

    //set defaults
    if(!options)
        options = {};

    options.req = this.req;
    options.session  = this.session;
 
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
    var view = this.context.getObject("views", file);
    if(!view){
        view = new View(file,this.context);
    }
    view.render(options,callbackForPage);

    //render layout
    options.body = body;
    
    var view = this.context.getObject("view", 'layout/'+this.layout);
    if(!view){
        view = new View('layout/'+this.layout,this.context);
    }
    view.render(options,callbackForLayout);
}

Controller.redirect = function(url){
    this.res.statusCode = 302;
    this.res.setHeader('Location', url);
    this.res.setHeader('Content-Length', 0);
    this.res.end();
}

Controller.write = function(body){
    this.res.write(body,"utf-8");
}

Controller.send = function(body){
    this.res.write(body,"utf-8");
    this.res.end();
}

Controller.get = function(key){
    return this.req.query[key];
}

Controller.post = function(key){
    return this.req.body[key];
}

Controller.session = function(key,val){
    if(val!==undefined){
        this.req.session[key] = val;
    }else{
        return this.req.session[key];
    }
}

Controller.action = function(name, func){
    this[name] = func;
}

Controller.beforeFilter = function(func){
    this.beforeFilter = func;
}

Controller.afterFilter = function(func){
    this.afterFilter = func;
}
