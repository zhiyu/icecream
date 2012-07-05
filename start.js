var icecream   = require('./lib/icecream');

var app = icecream.createServer();
app.listen(3000);
// app.engine('.html', require('ejs').__express);
// app.set('views', __dirname + '/app/views');
// app.set('view engine', 'html');
