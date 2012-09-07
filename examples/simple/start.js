var icecream   = require('../../src/lib/icecream');

icecream.createServer();

icecream.set('appRoot',  __dirname +'/app');
icecream.set('debug', false);

icecream.use(connect.session({ secret:'DFJLK8DFGJ933JKLFGJ2'}));

icecream.listen(3000);
