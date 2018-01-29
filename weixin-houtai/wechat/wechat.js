'use strict'
/*token验证*/

const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const fs = require('fs');
const util = require('./util.js');

const prefix = "https://api.weixin.qq.com/cgi-bin/";
let api = {
	accessToken: prefix+"token?grant_type=client_credential",
	upload: prefix+'media/upload?'
};

function Wechat(opts){
	let that = this;
	this.appId = opts.appId;
	this.appSecret = opts.appSecret;
	this.getAccessToken = opts.getAccessToken;
	this.saveAccessToken = opts.saveAccessToken;

	this.fetchAccesssToken();
};
// 获取票据
Wechat.prototype.fetchAccesssToken = function(data){
	let that = this;

	if(this.access_token && this.expires_in){
		if(this.isValidAcesssToken(this)){
			return Promise.resolve(this);
		}
	}
	this.getAccessToken()
	.then(function(data){
		try{
			data = JSON.parse(data);
		}
		catch(e){
			return that.updateAccessToken(data);
		}

		if(that.isValidAcesssToken(data)){
			return Promise.resolve(data); // 要return才能传出去
		}else{
			return that.updateAccessToken(data);
		}
	})
	.then(function(data){
		that.access_token = data.access_token;
		that.expires_in = data.expires_in;
		that.saveAccessToken(data);
		return Promise.resolve(data);
	});
};
// 验证票据
Wechat.prototype.isValidAcesssToken = function(data){
	if(!data || !data.access_token || !data.expires_in){
		return false;
	};
	let access_token = data.access_token,
		expires_in = data.expires_in,
		now = (new Date().getTime());
	if(now < expires_in) {
		return true;
	}else{
		return false;
	}
};
// 更新票据
Wechat.prototype.updateAccessToken = function(data){
	let appId = this.appId,
		appSecret = this.appSecret,
		url = api.accessToken + "&appid="+appId+"&secret="+appSecret;
	return new Promise((resolve, reject) => {
		request({url: url, json: true}).then(function(response){
			let data = response.body,
				now = (new Date().getTime()),
				expires_in = now + (data.expires_in-20)*1000;

			data.expires_in = expires_in;

			resolve(data);
		});		
	});
};
// 回复消息
Wechat.prototype.reply = function(){
	let content = this.body,
		message= this.weixin,
		xml = util.tpl(content, message);

	this.status = 200;
	this.type = 'application/xml';
	this.body = xml;

}
// 上传素材
Wechat.prototype.updloadMaterial = function(type, filePath){
	let that = this,
		form = {
			media: fs.createReadStream(filePath)
		},
		appId = this.appId,
		appSecret = this.appSecret;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url = api.upload + "access_token="+data.access_token+"&type="+type;
			request({method: 'POST', url: url, formData: form, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('Upload materials failed');
				}
			});		
		});
	});
};
module.exports=Wechat;