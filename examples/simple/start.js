var icecream   = require('icecream');

icecream.createServer();

icecream.set('appRoot',  __dirname +'/app');
icecream.set('defaultController', 'page');
icecream.set('defaultAction',  'index');
icecream.set('suffix',  '');

icecream.set('debug', true);

icecream.listen(3000);