beforeFilter(function(){
    this.validator = load('validator');
});

action("index", function(){
    validator.select("12345").length(6);
	test_global();
	render('index');
}); 

action("test", function(){
	send("test");
}); 

action("set_lang", function(){
	session("lang", "zh_CN");
	render('index');
}); 

action("del_lang", function(){
	session("lang", "");
	render('index');
}); 