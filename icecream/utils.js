/**
 * Copyright (c) 2012, Zhiyu Zheng. All rights reserved.
 * Licensed under the MIT License
 *
 * Hosted On Github :
 * http://github.com/zhiyu/icecream
 *   
 */

 
var utils = module.exports = {}

utils.merge = function(a,b){
    if (a && b) {
        for (var key in b) {
          a[key] = b[key];
        }
    }
    return a;
}