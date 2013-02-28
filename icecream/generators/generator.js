/**
 * Copyright (c) 2012, Zhiyu Zheng. All rights reserved.
 * Licensed under the MIT License
 *
 * Hosted On Github :
 * http://github.com/zhiyu/icecream
 *   
 */

var colors  = require('../utils/colors');
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
  highlight: 'magenta'
});

var exp = module.exports = {}

/**
 * Generate templates
 *
 * @method  generate
 * @params  {Object}  args  arguments from command line
 * @return  {void} 
 */
exp.generate = function(args){
	var info = "\n"+
	           " *  **  ***  **  ***   ***   *    * *  \n"+
               " *  *   **   *   ***   **   * *  * * *    \n"+
               " *  **  ***  **  *  *  ***  * *  *   *   \n";
              
    console.log(info.silly);
	           
    var app_generator = require('./app_generator');
    var module_generator = require('./module_generator');
    
    //args = args.slice(2);
	var type = args[0];
    
    if(type == undefined){
    	console.log("Error: incorrect parameters!");
        return;
    }

    if(type == '-c' || type == '--create' || type == 'create'){
    	app_generator.generate(args);

    }else{
    	module_generator.generate(args);
    }

    console.log("\n");    
}

//exp.generate(process.argv);