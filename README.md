### How to use
*   download source 
*   install npm
*   enter icecream
*   npm install
*   edit start.js
    
        var connect    = require('connect')
		var icecream   = require('./lib/icecream');

		icecream.createServer();
		icecream.use(connect.query());
		icecream.use(connect.bodyParser());
		icecream.use(connect.cookieParser());
		icecream.use(connect.session({ secret:'DFJLK8DFGJ933JKLFGJ2'}));
		icecream.listen(3000);

		icecream.set('defaultEngine', 'jade');
		icecream.set('appRoot',  __dirname +'/app');
		icecream.set('debug', true);
* node start.js		