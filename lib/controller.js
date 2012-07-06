var model      = require("./model");
var config      = require("./config");

module.exports = {
	data : {
		title : config.applicationName
	},

    getModel : function(config){
	  return model.getModel(config);
	}

}