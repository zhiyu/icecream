var common = module.exports = {}

common.lang = function(key, session){
  var languages = {};
  if(session && session["lang"]){
        languages = icecream.getObject("languages", session["lang"]);
  }else{
    languages = icecream.getObject("languages", icecream.get("defaultLanguage"));
  }
  return languages[key];
}

common.load = function(file, options){
    if(file.indexOf("/") == 0){
        var Func = require(icecream.get('appDir')+file);
        return new Func(options);
    }else{ 
        var Library = icecream.getObject("libraries", file);
        if(Library){
            return new Library(options);
        }
    }
}

common.string = function(file, key){
    var fs = require('fs');
    if(!icecream.getObject("strings", file)){
        var stringsDir = icecream.get("appDir")+"/strings/"+file;
        var data = fs.readFileSync(stringsDir);
        if(data){
           var object = {}; 
           var strings = data.toString().split('\n');
           for(var i in strings){
               var string = strings[i];
               if(string.indexOf("//")==-1 && string.indexOf("===")!=-1){
                  var k = string.split('===')[0];
                  var v = string.split('===')[1];
                  object[k] = v;
               }
           }
           icecream.setObject("strings", file, object);
        }
    }
    var strings = icecream.getObject("strings", file);
    return strings[key];
}