### How to use
*   download source 
*   edit start.js
    
        var express = require('../express/lib/express');
        var nodee   = require('./lib/nodee');
        var app     = express.createServer();
        app.register('.html', require('ejs'));
        app.set('views', __dirname + '/app/views');
        app.set('view engine', 'html');
        app.get('*', function(req, res){
            nodee.dispatch(req,res);
        });

        app.post('*', function(req, res){
            nodee.dispatch(req,res);
        });
        
        app.listen(8000);
