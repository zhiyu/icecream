beforeFilter(function(){
   //write("beforeFilter...");
});

action("index", function(){
	render('page/index');
}); 

action("test", function(){
	send("test");
}); 