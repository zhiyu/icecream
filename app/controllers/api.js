var model = require('../model/mysql')

var c = module.exports;

c.feedback = function(){
}

//get latest version
c.version = function(){
	var app_key = this.get('app_key')?this.get('app_key'):'';

	var self = this;
	var result = {
		status:1,
		errorMessage:'',
		data:{}
	};

	if(!app_key){
        result.status = 0;
        result.errorMessage = "parameter 'app_key' can not be empty!";
        self.send(JSON.stringify(result,null, 4));
        return;
	}

	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query("SELECT version,url,release_note from app_version where app_version.app_key='"+app_key+"' order by version desc", function(err, rows, fields) {
	    connection.end();
	    if (err) {
	    	console.log(err);
            result.status = 0;
            result.errorMessage = "请求发生错误";
	    }else{
	    	if(rows.length > 0)
                result.data = rows[0];
	    }
        self.send(JSON.stringify(result,null, 4));
	});
}

//add feedback
c.feedback = function(){
	var app_key = this.get('app_key')?this.get('app_key'):'';
	var content = this.get('content')?this.get('content'):'';

	var self = this;
	var result = {
		status:1,
		errorMessage:'',
		data:{}
	};

	if(!app_key){
        result.status = 0;
        result.errorMessage = "parameter 'app_key' can not be empty!";
        self.send(JSON.stringify(result,null, 4));
        return;
	}
	if(!content){
        result.status = 0;
        result.errorMessage = "parameter 'content' can not be empty!";
        self.send(JSON.stringify(result,null, 4));
        return;
	}

	var connection = model.getConnection();
	connection.query ("SET NAMES utf8");
	connection.query('insert into app_feedback set ?', {app_key:app_key,content:content},function(err, rows, fields) {
	    connection.end();
	    if (err) {
	    	console.log(err);
            result.status = 0;
            result.errorMessage = "请求发生错误";
	    }
        self.send(JSON.stringify(result,null, 4));
	});
}