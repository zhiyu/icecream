### How to use
*   download source 
*   edit start.js
    
        var icecream   = require('./lib/icecream');
        var app     = express.createServer();
        app.register('.html', require('ejs'));
        app.set('views', __dirname + '/app/views');
        app.set('view engine', 'html');
        app.get('*', function(req, res){
            icecream.dispatch(req,res);
        });

        app.post('*', function(req, res){
            icecream.dispatch(req,res);
        });
        
        app.listen(3000);
