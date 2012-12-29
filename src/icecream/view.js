var View = module.exports = function(){}
View.prototype.render = function(path, engine, options, callback){
    engine(path, options, callback);
}
