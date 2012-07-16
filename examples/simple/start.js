var icecream   = require('icecream');

icecream.createServer();

icecream.set('appRoot',  __dirname +'/app');
icecream.set('debug', true);

icecream.listen(3000);
