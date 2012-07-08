var model      = require("./model");
var config      = require("./config");

module.exports = {
    getModel : function(config){
	  return model.getModel(config);
	}

}