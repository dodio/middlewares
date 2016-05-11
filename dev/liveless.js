var less = require("less"),
		express = require("express"),
		p = require("path"),
		fs = require("fs"),
		debug = require('debug')('liveless'),
		nodePath = require('path')

/**
 * 编译less文件，或者与css同名less文件
 */
function liveless (root){
	var router = express.Router();

	router.get(["**.less","**.css"],function(req,res,next){
		var path = req.path,
				file = nodePath.join(root,path).replace(/\.css$/,".less")

		debug('compileing %s', file)
		fs.existsAsync(file)
		.then(function(){
			return fs.readFileAsync(file);
		})
		.then(function(input){
			var opt = {
				paths : [root],
				relativeUrls : true,
				strictUnits : true,
				ieCompat : true,
				filename : file ,
				compress : false ,
				yuicompress : false
			};
			return less.render( input.toString() ,opt);
		})
		.then(function(output){
			res.type("css");
			res.send(output.css);
		})
		.catch(function(err){
			if(err === false)
				return next()
			next(err)
		});
	})
	
	return router;
}

module.exports = liveless;

