var c = module.exports;

c.index = function(req,res){
        console.log("dd:"+req.session.user);
        res.render('page/index',this.data);
}

c.test = function(req,res){
    res.send("test1");
}

c.welcome2 = function(req,res){
    res.send("test2dd22");
}