/**
 * Copyright (c) 2012, Zhiyu Zheng. All rights reserved.
 * Licensed under the MIT License
 *
 * Hosted On Github :
 * http://github.com/zhiyu/icecream
 *   
 */


var View = module.exports = function(){}
View.prototype.render = function(path, engine, options, callback){
    engine(path, options, callback);
}
