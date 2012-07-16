var View       = require('./view');

//set 'render' method for controller
exports.render = function(file,options,callback){    
    var self = this;
    var body;

    //set defaults
    if(!options)
        options = {};

    options.req = this.req;
    options.session  = this.session;

    if(!callback){
        callback = function(arg,content){
            body = content;
            if(arg)
                body = arg.toString();
            else
                body = content;
        }
    }
    
    //render body
    var view = this.context.viewCaches[file];
    if(!view){
        view = new View(file,this.context);
    }
    view.render(options,callback);

    //render layout
    options.body = body;
    callback = function(arg,content){
        if(arg)
            self.send(arg.toString());
        else
            self.send(content);
    }
    var view = this.context.viewCaches['layout/'+this.layout];
    if(!view){
        view = new View('layout/'+this.layout,this.context);
    }
    view.render(options,callback);
}

//set 'redirect' method for controller
exports.redirect = function(url){
    res.statusCode = 302;
    res.setHeader('Location', url);
    res.setHeader('Content-Length', 0);
    res.end();
}

//set 'send' method for controller
exports.send = function(body){
    this.res.write(body,"utf-8");
    this.res.end();
}

//set 'get' method for controller
exports.get = function(key){
    return this.req.query[key];
}
 
//set 'get' method for controller
exports.post = function(key){
    return this.req.body[key];
}

//set 'session' method for controller
exports.session = function(key,val){
    if(val!==undefined){
        this.req.session[key] = val;
    }else{
        return this.req.session[key];
    }
}
