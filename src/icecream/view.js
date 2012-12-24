var path     = require('path');
var extname  = path.extname;

var View = module.exports = function(file, context) {
    this.context  = context || {};
    this.ext  = extname(file);

    if (!this.ext){
    	  this.ext = this.context.get('defaultEngine');
        file += '.' + this.context.get('defaultEngine');
    }
    this.viewRoot = this.context.get('appRoot')+'/views';
    this.path = this.viewRoot+'/'+file;
}

View.prototype.render = function(options, callback){
    this.context.engines[this.ext](this.path, options, callback);
}
