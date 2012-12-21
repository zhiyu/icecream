var View       = require('./view');
module.exports = {
    render : function(file, options, callback){    
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
        var view = this.context.getObject("views", file);
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
        var view = this.context.getObject("view", 'layout/'+this.layout);
        if(!view){
            view = new View('layout/'+this.layout,this.context);
        }
        view.render(options,callback);
    },
    redirect : function(url){
        this.res.statusCode = 302;
        this.res.setHeader('Location', url);
        this.res.setHeader('Content-Length', 0);
        this.res.end();
    },
    write : function(body){
        this.res.write(body,"utf-8");
    },
    send : function(body){
        this.res.write(body,"utf-8");
        this.res.end();
    },
    get : function(key){
        return this.req.query[key];
    },
    post : function(key){
        return this.req.body[key];
    },
    session : function(key,val){
        if(val!==undefined){
            this.req.session[key] = val;
        }else{
            return this.req.session[key];
        }
    },
    action : function(name, func){
        this[name] = func;
    },
    beforeFilter : function(func){
        this.beforeFilter = func;
    }
}
