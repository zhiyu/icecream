module.exports = {
    channels : function(req,res){
        console.log(req);
        var obj = {
            "status": "1",
            "errorMessage": "",
            "data": {
                "name": "zhengzhiyu",
                "photo": "http://m.baidu.com/zhengzhiyu.jpg"
            }
        }
        this.send(JSON.stringify(obj,null,4));
    }
}