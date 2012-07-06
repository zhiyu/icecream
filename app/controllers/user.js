module.exports = {
    index : function(req,res){
        var db = this.getModel('test');
        var data = this.data;

        req.session.user = "zzy";
        console.log("dd:"+req.session.user);

		db.query('select *from user',function selectCb(err, results, fields) {
			    if (err) {
			      throw err;
			    }
                //res.cookie('uname', 1, { maxAge: 60000 });
                //req.session.name = 'zzy';
                data.result = results;
    	        res.render('user/index', data);
            }
        );

    },

    login : function(req,res){
        res.send("{'dd':''}");
    }
}