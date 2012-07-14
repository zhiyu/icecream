var icecream   = require('./lib/icecream');

icecream.createServer();
icecream.set('debug', true);

icecream.listen(3000);
