var model = require('../model/mysql')

var c = module.exports;

c.beforeAction = function(){
	if(!this.session('user')){
        this.redirect('/user/login?redirect='+this.req.url);
	}

	if(this.session('user').role_code){
		
	}
}

/*
 * actions for user
 */
c.index = function(){
	var self = this;
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('SELECT user.*,role.role_name FROM user,role where user.role=role.id', function(err, rows, fields) {
	    connection.end();
	    if (err) 
	    	console.log(err);
        self.render('management/users',{users:rows});
	});
}

c.add_user = function(){
    var connection = model.getConnection();
    connection.query ("SET NAMES utf8");

	var self = this;
	this.layout = "empty";

	if(this.post("smt")){
      var user_name = this.post("user_name");
      var password  = this.post("password");
      var role      = this.post("role");
      var email     = this.post("email");
      var mobile    = this.post("mobile");

      var crypto      = require('crypto');
      var md5         = crypto.createHash('md5');
      md5.update(password,'utf8');
      var password    = md5.digest('hex');

      var params = {
      	user_name:user_name,
      	password:password,
      	role:role,
      	email:email,
      	mobile:mobile
      }

      connection.query('insert into user set ?', params,function(err, rows, fields) {
	    connection.end();
	    if (err) 
	    	self.send('failed');
	    else	
	    	self.send('success');
	  });
	}else{
		connection.query('SELECT *FROM role order by id asc', function(err, rows, fields) {
	        	connection.end();
		        if (err) 
	    	        console.log(err);
		        self.render('management/add_user',{roles:rows});
		});
	}
}

c.edit_user = function(){
	var self = this;
	this.layout = "empty";
	if(this.post("smt")){
      var id   = this.post("id");
      var user_name = this.post("user_name");
      var password  = this.post("password");
      var role      = this.post("role");
      var email     = this.post("email");
      var mobile    = this.post("mobile");
      
      var params = {
      	user_name:user_name,
      	role:role,
      	email:email,
      	mobile:mobile
      }

      if(password){
      	var crypto      = require('crypto');
        var md5         = crypto.createHash('md5');
        md5.update(password,'utf8');
        var password    = md5.digest('hex');
        params.password = password;
      }

      
      var connection = model.getConnection();
      connection.query ("SET NAMES utf8");
      connection.query('update user set ? where id='+id, params,function(err, rows, fields) {
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
      var roles;
      var users;

      var connection = model.getConnection();
      connection.query ("SET NAMES utf8");
      connection.query('SELECT *FROM user where id='+id, function(err, rows, fields) {
		    if (err) 
	    	  console.log(err);
	        users = rows;

	        connection.query('SELECT *FROM role order by id asc', function(err, rows, fields) {
	        	connection.end();
		        if (err) throw err;
	            roles = rows;
		        self.render('management/edit_user',{users:users,roles:roles});
		    });
	  });  
	}	    
}

c.del_user = function(){
    var self = this;
	var id   = this.post("id");
	
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('delete FROM user where id='+id, function(err, rows, fields) {
	    if (err) {
            console.log(err);
            self.send("failed");
	    }else{
            self.send("success");
	    }	    
	});

}

/*
 * actions for role
 */
c.roles = function(){
	var self = this;
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('SELECT *FROM role order by id', function(err, rows, fields) {
	    connection.end();
	    if (err) 
	      console.log(err);
        self.render('management/roles',{roles:rows});
	});
}

c.add_role = function(){
    var connection = model.getConnection();
    connection.query ("SET NAMES utf8");

	var self = this;
	this.layout = "empty";
	if(this.post("smt")){
      var role_name   = this.post("role_name");
      connection.query('insert into role set ?', {role_name:role_name},function(err, rows, fields) {
	    connection.end();
	    if (err){
	    	console.log(err);
	    	self.send('failed');
	    }else{	
	    	self.send('success');
	    }
	  });
	}else{
		self.render('management/add_role');
	}
}

c.edit_role = function(){
	var self = this;
	this.layout = "empty";
	if(this.post("smt")){
      var id   = this.post("id");
      var role_name   = this.post("role_name");

      var connection = model.getConnection();
      connection.query ("SET NAMES utf8");
      connection.query('update role set ? where id='+id, {role_name:role_name},function(err, rows, fields) {
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
      connection.query('SELECT *FROM role where id='+id, function(err, rows, fields) {
		    if (err) console.log(err);
	        self.render('management/edit_role',{roles:rows});
	  });  
	}	    
}

c.del_role = function(){
    var self = this;
	var id   = this.post("id");
	
	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('delete FROM role where id='+id, function(err, rows, fields) {
	    if (err) {
            console.log(err);
            self.send("failed");
	    }else{
            self.send("success");
	    }	    
	});

} 