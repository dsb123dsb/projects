'use strict'

const fs = require('fs');

exports.readFileAsync = function(fpath, encodning){
	return new Promise((resolve, reject) => {
		fs.readFile(fpath, encodning, function(err, content){
			if(err){
				reject(err);
			}else{
				resolve(content);
			}
		});
	});
};

exports.writeFileAsync = function(fpath, content){
	return new Promise((resolve, reject) => {
		fs.writeFile(fpath, content, function(err){
			if(err){
				reject(err);
			}else{
				resolve();
			}
		});
	});
};