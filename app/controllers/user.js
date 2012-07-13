var model = require('../model/mysql')
var c = module.exports;

c.beforeAction = function(){
	if(this.uri!='/user/login'){
	    if(!this.session('user'))
            this.redirect('/user/login?redirect='+this.url);
	}
}

c.login = function(){
	this.layout = 'login';
	var self = this;

	if(this.post("smt")){
      var email      = this.post("email");
      var password   = this.post("password");

      var crypto     = require('crypto');
      var md5        = crypto.createHash('md5');
      md5.update(password,'utf8');
      password    = md5.digest('hex');
      
      console.log(password);
      var cc = console;
      var connection = model.getConnection();
      connection.query ("SET NAMES utf8");
      connection.query("select *from user where email='"+email+"' and password='"+password+"'",function(err, rows, fields) {
	    connection.end();
	    if (err) {
	    	throw err;
	    	self.send('failed');
	    }else{
	    	if(rows.length > 0){
	    		self.session('user',rows[0]);
	    	    self.send('success');
	    	}else{
	    		self.send('failed');
	    	}
	    }
	  });
	}else{
		self.render('user/login');
	}	    
}

c.logout = function(){
	this.session('user',null);
	this.redirect('/user/login');
}