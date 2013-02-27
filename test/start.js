var connect    = require('../node_modules/connect');
var icecream   = require('../icecream/icecream');

icecream.createServer();

icecream.share({
	hello:function(){
		this.send("hello");
	}
})

icecream.global({
	test_global:function(){
		console.log("test global");
	}
});

icecream.listen(3000);
