var http = require('http')
var res  = http.ServerResponse.prototype;

res.send = function(body){
    this.write(body,"utf-8");
    this.end();
}