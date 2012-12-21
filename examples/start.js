var connect    = require('../../src/node_modules/connect');
var icecream   = require('../../src/lib/icecream');

icecream.createServer();
icecream.set('appRoot',  __dirname +'/app');
icecream.set('debug', true);
icecream.set('cluster', true);
icecream.use(connect.session({ secret:'DFJLK8DFGJ933JKLFGJ2'}));
icecream.share({
	hello:function(){
		this.send("hello");
	}
});
icecream.listen(3000);
