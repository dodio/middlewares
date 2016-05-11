var nodePath = require('path'),
    fa = global.fa,
    config = fa.config,
    fs = require('fs')

module.exports = function(){
  return autoTpl;
}

function autoTpl(req, res, next){
  var path = req.path.substring(1).replace(/\/$/,""),
      ext = nodePath.extname(path),
      viewExt = "." + config.fa.view.ext,
      viewRoot = fa.app.get("views"),
      tplFile,
      engines = ['.html','.ftl']

  if(ext !== viewExt && engines.indexOf(ext) == -1 && ext !== ''){
    return next()
  }
  
  path = path || 'index'

  if(ext === ''){
    tplFile = nodePath.join(viewRoot, path + viewExt)
    if(fs.existsSync(tplFile)){
      return res.render(path, res.data.get())
    }else{
      path += "/index" + viewExt
      tplFile = nodePath.join(viewRoot, path )
      return fs.existsSync(tplFile) ? res.render(path, res.data.get()) : next()
    }
  }else{
    return res.render(path, res.data.get(), function(err, str){
      if(err){
        // 如果是找不到模板，可以认为是请求后端接口
        return err.message.indexOf('Failed to lookup view') > -1 ? next() : next(err)
      }
      res.send(str);
    })
  }
  next();
}