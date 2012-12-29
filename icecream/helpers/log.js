var Log = module.exports = {}

//log message depending on debug mode
Log.log = function(message){
	if(icecream.get("debug"))
        console.log(message);
}