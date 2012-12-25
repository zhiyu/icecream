beforeFilter(function(){
  
});

action("index", function(){
	test_global();
	render('page/index');
}); 

action("test", function(){
	send("test");
}); 

action("set_lang", function(){
	session("lang", "zh_CN");
	render('page/index');
}); 

action("del_lang", function(){
	session("lang", "");
	render('page/index');
}); 