var connect    = require('../node_modules/connect');
var icecream   = require('icecream');

icecream.createServer();
icecream.set("appDir", __dirname +'/app');
icecream.set("debug", true);
icecream.set("cluster", true);
icecream.use(connect.cookieParser());
icecream.use(connect.session({ secret:'DFJLK8DFGJ933JKLFGJ2'}));

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
