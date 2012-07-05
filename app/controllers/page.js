module.exports = {
    index : function(req,res){
        console.log("dd:"+req.session.user);

        res.render('page/index',this.data);
    },

    upload: function(req,res){
    	var fs = require('fs');

        formidable = require('formidable');
    	var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			for(var i in files){
				console.log(files[i].path);
				fs.renameSync(files[i].path,"/tmp/"+files[i].name);
			}
		});

    	res.send('success');
    },

    file: function(req,res){
    	res.render('page/file',this.data);
    }
}