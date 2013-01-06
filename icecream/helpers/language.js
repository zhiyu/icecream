var Language = module.exports = {}

Language.lang = function(key, session){
	var languages = {};
	if(session && session["lang"]){
        languages = icecream.getObject("languages", session["lang"]);
	}else{
		languages = icecream.getObject("languages", icecream.get("defaultLanguage"));
	}
	return languages[key];
}