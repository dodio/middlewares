module.exports = function (conf) {
  var router = require('express').Router(),
      nodePath = require('path'),
      publicDir = conf.publicDir

  router.get(conf.urlPattern + "*", function(req, res, next){
    var file = nodePath.join(publicDir, req.path);
    res.sendFile(file, function(err){
      if(err){
        next()
      }
    })
  })
  return router
}