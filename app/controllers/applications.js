var model = require('../model/mysql')

var c = module.exports;

c.beforeAction = function(){
	if(!this.session('user')){
        this.redirect('/user/login?redirect='+this.req.url);
	}

    Date.prototype.format = function(format){
	 /*
	  * eg:format="YYYY-MM-dd hh:mm:ss";
	  */
	 var o = {
	  "M+" :  this.getMonth()+1,  //month
	  "d+" :  this.getDate(),     //day
	  "h+" :  this.getHours(),    //hour
	      "m+" :  this.getMinutes(),  //minute
	      "s+" :  this.getSeconds(), //second
	      "q+" :  Math.floor((this.getMonth()+3)/3),  //quarter
	      "S"  :  this.getMilliseconds() //millisecond
	   }
	   if(/((|Y|)+)/.test(format)) {
	    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	   }
	 
	   for(var k in o) {
	    if(new RegExp("("+ k +")").test(format)) {
	      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	    }
	   }
	 return format;
	}
}

/*
 * actions for application
 */
c.index = function(){
	var self = this;
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('SELECT app.*,app_type.type_name FROM app,app_type where app.app_type=app_type.id', function(err, rows, fields) {
	    connection.end();
	    if (err) 
	    	console.log(err);
        self.render('applications/index',{apps:rows});
	});
}

c.add = function(){
    var connection = model.getConnection();
    connection.query ("SET NAMES utf8");

	var self = this;
	this.layout = "empty";
	if(this.post("smt")){
      var app_name   = this.post("app_name");
      var app_type   = this.post("app_type");

      var crypto     = require('crypto');
      var time       = new Date().getTime();
      
      var md5        = crypto.createHash('md5');
      md5.update(app_name+time,'utf8');
      var app_key    = md5.digest('hex').toUpperCase();

      md5            = crypto.createHash('md5');
      md5.update(app_name+app_type+time,'utf8');
      var app_secret = md5.digest('hex').toUpperCase();

      connection.query('insert into app set ?', {app_name:app_name,app_type:app_type,app_key:app_key,app_secret:app_secret},function(err, rows, fields) {
	    connection.end();
	    if (err) 
	    	self.send('failed');
	    else	
	    	self.send('success');
	  });
	}else{
		connection.query('SELECT *FROM app_type order by id asc', function(err, rows, fields) {
	        	connection.end();
		        if (err) 
	    	        console.log(err);
		        self.render('applications/add',{app_types:rows});
		});
	}
}

c.edit = function(){
	var self = this;
	this.layout = "empty";
	if(this.post("smt")){
      var id   = this.post("id");
      var app_name   = this.post("app_name");
      var app_type   = this.post("app_type");

      var connection = model.getConnection();
      connection.query ("SET NAMES utf8");
      connection.query('update app set ? where id='+id, {app_name:app_name,app_type:app_type},function(err, rows, fields) {
	    connection.end();
	    if (err) {
	    	console.log(err);
	    	self.send('failed');
	    }else{
	    	self.send('success');
	    }
	  });
	}else{
      var id   = this.post("id");
      var app_types;
      var apps;

      var connection = model.getConnection();
      connection.query ("SET NAMES utf8");
      connection.query('SELECT *FROM app where id='+id, function(err, rows, fields) {
		    if (err) 
	    	  console.log(err);
	        apps = rows;

	        connection.query('SELECT *FROM app_type order by id asc', function(err, rows, fields) {
	        	connection.end();
		        if (err) throw err;
	            app_types = rows;
		        self.render('applications/edit',{apps:apps,app_types:app_types});
		    });
	  });  
	}	    
}

c.del = function(){
    var self = this;
	var id   = this.post("id");
	
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('delete FROM app where id='+id, function(err, rows, fields) {
	    if (err) {
            console.log(err);
            self.send("failed");
	    }else{
            self.send("success");
	    }	    
	});

}

/*
 * actions for type
 */
c.types = function(){
	var self = this;
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('SELECT *FROM app_type order by id', function(err, rows, fields) {
	    connection.end();
	    if (err) 
	      console.log(err);
        self.render('applications/types',{types:rows});
	});
}

c.add_type = function(){
    var connection = model.getConnection();
    connection.query ("SET NAMES utf8");

	var self = this;
	this.layout = "empty";
	if(this.post("smt")){
      var type_name   = this.post("type_name");
      connection.query('insert into app_type set ?', {type_name:type_name},function(err, rows, fields) {
	    connection.end();
	    if (err){
	    	console.log(err);
	    	self.send('failed');
	    }else{	
	    	self.send('success');
	    }
	  });
	}else{
		self.render('applications/add_type');
	}
}

c.edit_type = function(){
	var self = this;
	this.layout = "empty";
	if(this.post("smt")){
      var id   = this.post("id");
      var type_name   = this.post("type_name");

      var connection = model.getConnection();
      connection.query ("SET NAMES utf8");
      connection.query('update app_type set ? where id='+id, {type_name:type_name},function(err, rows, fields) {
	    connection.end();
	    if (err){
	    	console.log(err);
	    	self.send('failed');
	    }else{	
	    	self.send('success');
	    }
	  });
	}else{
      var id   = this.post("id");
      var connection = model.getConnection();
      connection.query ("SET NAMES utf8");
      connection.query('SELECT *FROM app_type where id='+id, function(err, rows, fields) {
		    if (err) console.log(err);
	        self.render('applications/edit_type',{types:rows});
	  });  
	}	    
}

c.del_type = function(){
    var self = this;
	var id   = this.post("id");
	
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('delete FROM app_type where id='+id, function(err, rows, fields) {
	    if (err) {
            console.log(err);
            self.send("failed");
	    }else{
            self.send("success");
	    }	    
	});

} 

/*
 * actions for version
 */
c.versions = function(){
	var self = this;
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('SELECT app_version.*,app.app_name FROM app_version,app where app.app_key=app_version.app_key', function(err, rows, fields) {
	    connection.end();
	    if (err) 
	    	console.log(err);
        self.render('applications/versions',{versions:rows});
	});
}

c.add_version = function(){
    var connection = model.getConnection();
    connection.query ("SET NAMES utf8");

	var self = this;
	this.layout = "empty";
	if(this.post("smt")){
      var app_key      = this.post("app_key");
      var version      = this.post("version");
      var url          = this.post("url");
      var release_note = this.post("release_note");

      connection.query('insert into app_version set ?', {app_key:app_key,version:version,url:url,release_note:release_note},function(err, rows, fields) {
	    connection.end();
	    if (err) 
	    	self.send('failed');
	    else	
	    	self.send('success');
	  });
	}else{
		connection.query('SELECT *FROM app order by id asc', function(err, rows, fields) {
	        	connection.end();
		        if (err) 
	    	        console.log(err);
		        self.render('applications/add_version',{apps:rows});
		});
	}
}

c.edit_version = function(){
	var self = this;
	this.layout = "empty";
	if(this.post("smt")){
      var id   = this.post("id");
      var app_key      = this.post("app_key");
      var version      = this.post("version");
      var url          = this.post("url");
      var release_note = this.post("release_note");

      var connection = model.getConnection();
      connection.query ("SET NAMES utf8");
      connection.query('update app_version set ? where id='+id, {app_key:app_key,version:version,url:url,release_note:release_note},function(err, rows, fields) {
	    connection.end();
	    if (err) {
	    	console.log(err);
	    	self.send('failed');
	    }else{
	    	self.send('success');
	    }
	  });
	}else{
      var id   = this.post("id");
      var app_versions;
      var apps;
      var connection = model.getConnection();
      connection.query ("SET NAMES utf8");
      connection.query('SELECT *FROM app_version where id='+id, function(err, rows, fields) {
		    if (err) 
	    	  console.log(err);
	        app_versions = rows;

	        connection.query('SELECT *FROM app order by id asc', function(err, rows, fields) {
	        	connection.end();
		        if (err) throw err;
	            apps = rows;
		        self.render('applications/edit_version',{app_versions:app_versions,apps:apps});
		    });
	  });  
	}	    
}

c.del_version = function(){
    var self = this;
	var id   = this.post("id");
	
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('delete FROM app_version where id='+id, function(err, rows, fields) {
	    if (err) {
            console.log(err);
            self.send("failed");
	    }else{
            self.send("success");
	    }	    
	});

}

/*
 * actions for feedbacks
 */
c.feedbacks = function(){
	var self = this;
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('SELECT app.app_name,app_feedback.* FROM app,app_feedback where app.app_key=app_feedback.app_key order by app_feedback.feedback_created desc', function(err, rows, fields) {
	    connection.end();
	    if (err) console.log(err);
        self.render('applications/feedbacks',{feedbacks:rows});
	});
}

c.del_feedback = function(){
    var self = this;
	var id   = this.post("id");
	
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('delete FROM app_feedback where id in ('+id+')', function(err, rows, fields) {
	    if (err) {
            console.log(err);
            self.send("failed");
	    }else{
            self.send("success");
	    }	    
	});

} 