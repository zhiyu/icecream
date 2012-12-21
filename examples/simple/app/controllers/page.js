beforeFilter(function(){
   //write("beforeFilter...");
});

action("index", function(){
	console.log('This process is pid ' + process.pid);
	render('page/index');
}); 

action("test", function(){
	send("test");
}); 