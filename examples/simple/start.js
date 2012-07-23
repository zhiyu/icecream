var icecream   = require('../../src/lib/icecream');

icecream.createServer();

icecream.set('appRoot',  __dirname +'/app');
icecream.set('debug', false);

icecream.listen(3000);
