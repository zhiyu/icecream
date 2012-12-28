var Pool = module.exports = function(options){
    this.name = '';
    this.maxSize = 5;
    this.minSize = 1;
    this.resources = [];
    this.availableResources = [];
    this.merge(this, options);
    this.init();
}

var prototype = Pool.prototype;

prototype.init = function(){
    for(var i=0;i< this.minSize;i++){
        this.createResource();
    }
}

prototype.createResource = function(){
    var self = this;
    this.create(function(error,resource){
        self.resources.push(resource);
        self.availableResources.push(resource);
    });
}

prototype.create = function(callback){}
prototype.destroy  = function(resource){}

prototype.retain = function(callback){
    if(this.availableResources.length > 0){
    	var resource = this.availableResources.shift();
        callback(null, resource);
        return;
    }

    if(this.resources.length < this.maxSize){
        this.createResource();
        this.retain(callback);
    }else{
        callback(null, null);
    }
}

prototype.release = function(resource){
    this.availableResources.push(resource);
}

prototype.merge = function(a,b){
    if (a && b) {
        for (var key in b) {
          a[key] = b[key];
        }
    }
    return a;
}