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

exports.loadFiles = function(dirname, dir, fn){
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(function(file) {
            var stat = fs.lstatSync(dir+"/"+file);  
            if(stat.isDirectory() == true){  
                exports.loadFiles((dirname==''?"":dirname+"/")+file, dir+"/"+file, fn);
            }else{
                if(path.extname(file) == '.js'){
                    var obj = require(dir+"/"+file);
                    var fileName = (dirname==''?"":dirname+"/")+path.basename(file, ".js");
                    fn(fileName, obj);
                }  
            }         
        });
    }
}