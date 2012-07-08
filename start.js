var connect    = require('connect')
var icecream   = require('./lib/icecream');

icecream.createServer();
icecream.use(connect.cookieParser());
icecream.use(connect.session({ secret:'DFJLK8DFGJ933JKLFGJ2'}));
icecream.listen(3000);

icecream.set('defaultEngine', 'jade');
icecream.set('viewRoot', __dirname +'/app/views');
icecream.set('debug', false);