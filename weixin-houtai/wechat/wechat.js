'use strict'

const Promise = require('bluebird');
const request = Promise.promisify(require('request'));


const prefix = "https://api.weixin.qq.com/cgi-bin/";
let api = {
	accessToken: prefix+"token?grant_type=client_credential"
};

function Wechat(opts){
	let that = this;
	this.appId = opts.appId;
	this.appSecret = opts.appSecret;
	this.getAccessToken = opts.getAccessToken;
	this.saveAccessToken = opts.saveAccessToken;

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
		});
}

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

module.exports=Wechat;