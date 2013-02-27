/**
 * Copyright (c) 2012, Zhiyu Zheng. All rights reserved.
 * Licensed under the MIT License
 *
 * Hosted On Github :
 * http://github.com/zhiyu/icecream
 *   
 */

 
var Log = module.exports = {}

//log message depending on debug mode
Log.log = function(message){
	if(icecream.get("debug"))
        console.log(message);
}