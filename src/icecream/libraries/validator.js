var Validator = module.exports = function(options){
    
}

var prototype = Validator.prototype;

prototype.select = function(objects){
    this.objects = objects;
    return this;
}

prototype.match = function(valid){
    var object; 
    if(this.type() === Array){
        for(var i in this.objects){
            object = this.objects[i];
            if(!valid(object)){
                return false;
            }
        }
    }else if(this.type() === String){
        object = this.objects
        if(!valid(object))
            return false;
    }
    return true;
}

prototype.isNumeric = function(){
    return this.match(function(object){
        return object.match(/^-?[0-9]+$/);
    });
}

prototype.isInt = function(){
    return this.match(function(object){
        return object.match(/^(?:-?(?:0|[1-9][0-9]*))$/);
    });
}

prototype.isDecimal = function(){
    return this.match(function(object){
        return object.match(/^(?:-?(?:0|[1-9][0-9]*))?(?:\.[0-9]*)?$/);
    });
}

prototype.isArray = function(){
    return Array.isArray(this.objects);
}

prototype.isEmail = function(){
    return this.match(function(object){
        return object.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
    });
}

prototype.isUrl = function(){
    return this.match(function(object){
        return object.match(/^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i);
    });
}

prototype.isIP = function(){
    return this.match(function(object){
        return object.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    });
}

prototype.isAlpha = function(){
    return this.match(function(object){
        return object.match(/^[a-zA-Z]+$/);
    });
}

prototype.isAlphaAndNumber = function(){
    return this.match(function(object){
        return object.match(/^[a-zA-Z0-9]+$/);
    });
}

prototype.isLowercase = function(){
    return this.match(function(object){
        return object.match(/^[a-z0-9]+$/);
    });
}

prototype.isUppercase = function(){
    return this.match(function(object){
        return object.match(/^[A-Z0-9]+$/);
    });
}

prototype.notEmpty = function(){
    return this.match(function(object){
        return object.match(/^[\s\t\r\n]*$/);
    });
}

prototype.contains = function(str){
    return this.match(function(object){
        return object.indexOf(str)!=-1;
    });
}

prototype.startWith = function(str){
    return this.match(function(object){
        return object.indexOf(str) == 0;
    });
}

prototype.endWith = function(str){
    return this.match(function(object){
        return object.lastIndexOf(str) == object.length - str.length;
    });
}

prototype.length = function(min, max){
    return this.match(function(object){
        if(max){
            return object.length >= min && object.length <= max;
        }
        
        return object.length >= min;
    });
}

prototype.type = function(){
    return this.objects.constructor;
}



