var c = module.exports;

c.index = function(r){
    console.log("dd:"+this.req.session.user);
    this.render('page/index',{});
}