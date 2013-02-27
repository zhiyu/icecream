/**
 * Copyright (c) 2012, Zhiyu Zheng. All rights reserved.
 * Licensed under the MIT License
 *
 * Hosted On Github :
 * http://github.com/zhiyu/icecream
 *   
 */


var ejs = require('ejs');
var fs  = require('fs');
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
	// icecream -g user add(username:text,password:password,des:textarea,gender:text) edit view del

	this.args = args;

	var wrench = require('wrench');
    var cwd = process.cwd();
    var name = args[1];

    var methods = [];
    for(var i = 2; i < args.length; i++){
        methods.push(args[i]);
    }

    //generate controller file
    var controllerDir  = cwd+"/app/controllers/";
    var controllerFile = controllerDir + name + '.js';
  
    wrench.mkdirSyncRecursive(controllerDir);  
    console.log("create ".green.bold + controllerDir.input);

    ejs.renderFile(
    	__dirname+"/templates/default/controller.js", 
        {
       	    methods : methods
        }, 
        function(err, data){
        	if(err)
    	       console.log(err);
    	    else{
               fs.writeFileSync(controllerFile, data, 'utf-8');
               console.log("create controller ".info.bold + name.verbose+ (" with methods "+methods.join(", ")).highlight +"    "+ controllerFile.input);
    	    }
        }
    );

    //generate view file
    var viewDir  = cwd+"/app/views/" + name + "/";
    wrench.mkdirSyncRecursive(viewDir);  
    console.log("create ".green.bold + viewDir.input);
    
    methods.forEach(function(method){
    	var viewFile = viewDir + method + '.ejs';
        ejs.renderFile(
	    	__dirname+"/templates/default/view.js", 
	        {
	       	    methods : methods
	        }, 
	        function(err, data){
	        	if(err)
	    	       console.log(err);
	    	    else{
	               fs.writeFileSync(viewFile, data, 'utf-8');
	               console.log("create view ".info.bold + method.verbose+ (" with methods "+methods.join(", ")).highlight +"    "+ viewFile.input);
	    	    }
	        }
	    );
    });
    
	//this.generateDirectories().generateFiles();
}
