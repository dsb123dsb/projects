'use strict'

const fs = require('fs');
const Promise = require('bluebird');

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

const crypto = require('crypto');
// 安全域名也要改
let createNonce = function(){
	return Math.random().toString(36).substr(2, 15);
};
let createTimestamp = function(){
	return parseInt(new Date().getTime()/1000, 10) + ''; 
};
let _sign = function(nonceStr, ticket, timestamp, url){
	let params = [
		'noncestr='+nonceStr,
		'jsapi_ticket='+ticket,
		'timestamp='+timestamp,
		'url='+url
	];
	let str = params.sort().join('&'); // 忘记加分隔符，你麻痹，浪费两个小时

	let shasum = crypto.createHash('sha1');

	shasum.update(str);
	return shasum.digest('hex');
}
exports.sign=function(ticket, url){
	let nonceStr = createNonce(),
		timestamp = createTimestamp(),
		signature = _sign(nonceStr, ticket, timestamp, url);

		return {
			nonceStr: nonceStr,
			timestamp: timestamp,
			signature: signature
		};
}