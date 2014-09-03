/**
 * Copyright (c) 2012, Zhiyu Zheng. All rights reserved.
 * Licensed under the MIT License
 *
 * Hosted On Github :
 * http://github.com/zhiyu/icecream
 *   
 */

 
var Validator = module.exports = function(){}

var prototype = Validator.prototype;

prototype.select = function(objects){
    this.objects = objects;
    return this;
}

prototype.match = function(validate){
    var object; 
    if(this.type() === Array){
        for(var i in this.objects){
            object = this.objects[i];
            if(!validate(object+"")){
                return false;
            }
        }
    }else if(this.type() === String){
        object = this.objects
        if(!validate(object+""))
            return false;
    }else if(this.type() === Object){
        for(var i in this.objects){
            object = this.objects[i];
            if(!validate(object+"")){
                return false;
            }
        }
    }
    return true;
}

prototype.isNumeric = function(){
    return this.match(function(object){
        return object.search(/^-?[0-9]+$/)==-1?false:true;
    });
}

prototype.isInt = function(){
    return this.match(function(object){
        return object.search(/^(?:-?(?:0|[1-9][0-9]*))$/)==-1?false:true;
    });
}

prototype.isDecimal = function(){
    return this.match(function(object){
        return object.search(/^(?:-?(?:0|[1-9][0-9]*))?(?:\.[0-9]*)?$/)==-1?false:true;
    });
}

prototype.isArray = function(){
    return Array.isArray(this.objects);
}

prototype.isEmail = function(){
    return this.match(function(object){
        return object.search(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)==-1?false:true;
    });
}

prototype.isUrl = function(){
    return this.match(function(object){
        return object.search(/^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i)==-1?false:true;
    });
}

prototype.isIP = function(){
    return this.match(function(object){
        return object.search(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)==-1?false:true;
    });
}

prototype.isMobile = function(){
    return this.match(function(object){
        return object.search(/^1[3|4|5|7|8][0-9]\d{8}$/)==-1?false:true;
    });
}

prototype.isAlpha = function(){
    return this.match(function(object){
        return object.search(/^[a-zA-Z]+$/)==-1?false:true;
    });
}

prototype.isAlphaAndNumber = function(){
    return this.match(function(object){
        return object.search(/^[a-zA-Z0-9]+$/)==-1?false:true;
    });
}

prototype.isLowercase = function(){
    return this.match(function(object){
        return object.search(/^[a-z0-9]+$/)==-1?false:true;
    });
}

prototype.isUppercase = function(){
    return this.match(function(object){
        return object.search(/^[A-Z0-9]+$/)==-1?false:true;
    });
}

prototype.notEmpty = function(){
    return this.match(function(object){
        return object.search(/^[\s\t\r\n]*$/)==-1?true:false;
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