var icecream   = require('./lib/icecream');

var app = icecream.createServer();
app.listen(3000);
// app.use(express.bodyParser());
// app.use(express.cookieParser('secret'));
// app.use(
// 	express.session({
// 		secret: 'secret'
// 	})
// );

// app.engine('.html', require('ejs').__express);
// app.set('views', __dirname + '/app/views');
// app.set('view engine', 'html');

// app.get('*', function(req, res){
//     nodee.dispatch(req,res);
// });

// app.post('*', function(req, res){
//     nodee.dispatch(req,res);
// });

// app.listen(3000);