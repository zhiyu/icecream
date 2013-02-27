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
	var wrench = require('wrench');
    var cwd = process.cwd();
    var name = args[1];
    wrench.copyDirSyncRecursive(__dirname+"/templates/default/app", cwd+"/"+name); 
    console.log("create app ".info.bold + name.verbose +"    "+ (cwd+"/"+name).input);
	    	    
}