var nodePath = require('path'),
    fs = require('fs'),
    exist = fs.existsSync

module.exports = mockFactory

function mockFactory(conf) {
  var router = require('express').Router(),
    urlPattern = conf.urlPattern,
    pathPrex = urlPattern.replace(/\/$/,''), //去掉最后的/
    prexReg = new RegExp("^" + pathPrex),
    dataPath = conf.dataPath,
    shouldSkipNotFound = conf.skipNotFound

  if(!dataPath && typeof dataPath != 'string'){
    throw new Error('please specify the data path(String).')
  }
  if(!urlPattern && typeof urlPattern != 'string'){
    throw new Error('please specify the url pattern(String).')
  }

  router.use(urlPattern, mock)

  function mock(req, res, next) {
    var path = pathPrex == "" ? req.path : req.path.replace(prexReg, ''),
      filePath = nodePath.join(dataPath, path),
      ext = nodePath.extname(path)

    // mock send file
    if (ext != "") {
      return res.sendFile(filePath, function(err) {
        if (err) {
          // 失败了也再尝试将文件当作restrul的形式来mock
          mockRestFul()
        }
      })
    }
      
    mockRestFul()

    function mockRestFul(){
      filePath = filePath.replace(/\/$/, "")
      console.log(filePath);
      var method = req.method.toLowerCase(),
        dirPath = filePath + "/index",
        jsFile = parsePrefer(filePath, method, '.js'),
        jsonFile = parsePrefer(filePath, method, '.json'),
        jsDir = parsePrefer(dirPath, method, '.js'),
        jsonDir = parsePrefer(dirPath, method, '.json')

      if (jsFile) {
        return require(jsFile)(req, res, next)

      }
      if (jsonFile) {
        return res.sendFile(jsonFile)
      }
      if (jsDir) {
        return require(jsDir)(req, res, next)

      }
      if (jsonDir) {
        return res.sendFile(jsonDir)
      }
      
      !!shouldSkipNotFound ? next() : next(new FaError('not found mock data', 404))
    }
  }

  return router
}


function parsePrefer(path, method, ext) {
  var methodFile = path + "-" + method + ext,
    file = path + ext

  if (exist(methodFile)) {
    return methodFile
  }
  if (exist(file)) {
    return file
  }
  return ""
}
