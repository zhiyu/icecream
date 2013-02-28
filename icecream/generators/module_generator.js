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

var inputTemplate = {
    'text'     : '<input type="text" name="<%-name%>" />',
    'password' : '<input type="password" name="<%-name%>" />',
    'textarea' : '<textarea name="<%-name%>"></textarea>',
    'radio'    : '<input type="radio" name="<%-name%>"/>',
    'checkbox' : '<input type="checkbox" name="<%-name%>"/>'
}

var exp = module.exports = {}

/**
 * Generate templates
 *
 * @method  generate
 * @params  {Object}  args  arguments from command line
 * @return  {void} 
 */
exp.generate = function(args){
	// icecream -g user add[username:text,password:password,des:textarea,gender:text] edit view del
    console.log(process.argv);

	this.args = args;

	var wrench = require('wrench');
    var cwd = process.cwd();
    var name = args[1];

    var methods = [];
    for(var i = 2; i < args.length; i++){
    	var method = {};
    	var arg = args[i];
    	if(arg.indexOf('[')!=-1){
            method.name = arg.split('[')[0];
            method.fields = [];
            var fields = arg.split('[')[1].substr(0, arg.split('[')[1].length - 1).split(',');
            fields.forEach(function(field){
                var f = {};
                f.name = field.split(':')[0];
                if(field.split(':').length > 1){
                    f.type = field.split(':')[1];
                }else{
                	f.type = 'text';
                }
                method.fields.push(f);
            });
    	}else{
            method['name'] = arg;
    	}
        methods.push(method);
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
               console.log("create controller ".info.bold + name.verbose+ (" with methods "+ JSON.stringify(methods)).highlight +"    "+ controllerFile.input);
    	    }
        }
    );

    //generate view file
    var viewDir  = cwd+"/app/views/" + name + "/";
    wrench.mkdirSyncRecursive(viewDir);  
    console.log("create ".green.bold + viewDir.input);
    
    methods.forEach(function(method){
    	var viewFile = viewDir + method.name + '.ejs';
    	var elements = {};
    	if(method.fields){
            method.fields.forEach(function(field){
                elements[field.name] = ejs.render(inputTemplate[field.type], field);
            });
    	}

        ejs.renderFile(
	    	__dirname+"/templates/default/view.js", 
	        {
	        	controller : name,
	       	    method : method,
                elements : elements
	        }, 
	        function(err, data){
	        	if(err)
	    	       console.log(err);
	    	    else{
	               fs.writeFileSync(viewFile, data, 'utf-8');
	               console.log("create view ".info.bold + method.name.verbose+ (" with methods "+JSON.stringify(methods)).highlight +"    "+ viewFile.input);
	    	    }
	        }
	    );
    });
}
