var connect    = require('../src/node_modules/connect');
var icecream   = require('../src/');

icecream.createServer({
	appDir: __dirname +'/app',
    debug: true,
    cluster: true
});

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
