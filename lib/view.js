var path     = require('path');
var dirname  = path.dirname;
var basename = path.basename;
var extname  = path.extname;
var join     = path.join;
var fs       = require('fs');
var utils    = require('./utils');
var exists   = fs.existsSync;

var View = module.exports = function(file, context) {
  this.context  = context || {};
  this.ext  = extname(file);

  if (!this.ext){
  	  this.ext = this.context.get('defaultEngine');
      file += '.' + this.context.get('defaultEngine');
  }
  this.viewRoot = this.context.get('viewRoot');
  this.path = this.find(file);
}

View.prototype.find = function(path){
  var ext = this.ext;
  // <path>.<engine>
  if (!utils.isAbsolute(path)){
  	path = join(this.viewRoot, path);
  }
  if (exists(path)) 
  	return path;
  // <path>/index.<engine>
  path = join(dirname(path), basename(path, ext), 'index' + ext);
  if (exists(path)) 
  	return path;
};

View.prototype.render = function(options, callback){
  this.context.engines[this.ext](this.path, options, callback);
};
