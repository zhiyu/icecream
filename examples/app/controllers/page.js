beforeFilter(function(){

});

action("index", function(){
	render('page/index');
}); 

action("test", function(){
	send("test");
}); 