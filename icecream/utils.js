/**
 * Copyright (c) 2012, Zhiyu Zheng. All rights reserved.
 * Licensed under the MIT License
 *
 * Hosted On Github :
 * http://github.com/zhiyu/icecream
 *   
 */

var fs    = require('fs');
var path  = require('path');

var exports = module.exports = {}

exports.merge = function(a,b){
    if (a && b) {
        for (var key in b) {
          a[key] = b[key];
        }
    }
    return a;
}

exports.loadFiles = function(dir, fn){
	if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(function(file) {
            if(path.extname(file) == '.js'){
                var obj = require(dir+file);
                var fileName = path.basename(file, ".js");
                fn(fileName,obj);
            }            
        });
    }
}