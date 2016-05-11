module.exports = function (conf) {
  
  var api = function(req, res, next){
    var params = req.params,
        versionStack = [params.apiname]
    
    var api = fa.bee.apply(null,versionStack),
        data = {
          qs: req.query,
          form: req.body
        };
    if(api) {
      var beeObj = api[req.method.toLowerCase()](params[0],data);
      beeObj.bee.pipe(res);
    } else {
      res.send({
        status: 503,
        msg: "访问的接口不存在"
      })
    }
  }

  return api;
}