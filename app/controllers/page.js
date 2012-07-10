var c = module.exports;

c.index = function(req,res){
    console.log("dd:"+req.session.user);
    this.render('page/index',{});
}