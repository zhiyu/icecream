var Log = module.exports = {}

Log.log = function(message){
	if(icecream.get("debug"))
        console.log(message);
}