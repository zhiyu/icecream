var connect    = require('../node_modules/connect');
var app = require('../icecream/');

app.createServer();

app.share({
	hello:function(){
		this.send("hello");
	}
})

app.global({
	test_global:function(){
		console.log("test global");
	}
});

app.listen(3000);
