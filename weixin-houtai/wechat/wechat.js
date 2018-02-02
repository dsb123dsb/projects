'use strict'
/*token验证*/

const Promise = require('bluebird');
const _ = require('lodash');
const request = Promise.promisify(require('request'));
const fs = require('fs');
const util = require('./util.js');

const prefix = "https://api.weixin.qq.com/cgi-bin/";
let api = {
	accessToken: prefix+"token?grant_type=client_credential",
	temporary: {
		upload: prefix+'media/upload?',
		fetch: prefix+'media/get/'
	},
	permanent: {
		upload: prefix+'material/add_material?',
		uploadNews: prefix+'material/add_news?',
		uploadNewsPic: prefix+'media/uploadimg?',
		fetch: prefix+'material/get_material',
		del: prefix+ 'material/del_material',
		update: prefix+'material/update_news'
	}
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
Wechat.prototype.updloadMaterial = function(type, material, permanent){
	let that = this,
		form = {},
		uploadUrl = api.temporary.upload,
		appId = this.appId,
		appSecret = this.appSecret;

	if(permanent){
		uploadUrl = api.permanent.upload;
		_.extend(form, permanent);
	}
	if(type === 'pic'){
		uploadUrl = api.permanent.uploadNewsPic;
	}
	if(type === 'news'){
		uploadUrl = api.permanent.uploadNews;
		form = material;
	}else{
		form.media = fs.createReadStream(material);
	}

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = uploadUrl + "access_token="+data.access_token;
			if(!permanent){
				url += '&type=' + type;
			}else{
				form.access_token = data.access_token;
			}

			let options = {
				method: 'POST',
				url: url,
				json: true
			};

			if(type === 'news'){
				options.body = form;
			}else{
				options.formData = form;
			}

			request({method: 'POST', url: url, formData: form, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('Upload materials failed');
				}
			})
			.catch(function(err){
				reject(err)
			});		
		});
	});
};
// 删除素材
Wechat.prototype.deleteMaterial = function(mediaId){
	let that = this,
		form = {
			media_id: mediaId
		};

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = api.permanent.del + "access_token="+data.access_token+"&media_id="+mediaId;

			request({method: 'POST', url: url, body: form, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('delete materials failed');
				}
			})
			.catch(function(err){
				reject(err)
			});	
		});
	});
};
// 获取素材
Wechat.prototype.fetchMaterial = function(media_id, type, permanent){
	let that = this,
		form = {},
		fetchUrl = api.temporary.fetch,
		appId = this.appId,
		appSecret = this.appSecret;

	if(permanent){
		fetchUrl = api.permanent.fetch;
	}

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = fetchUrl + "access_token="+data.access_token+"&media_id="+media_id;
			if(!permanent && type ==='video'){
				url = url.replace('https://', 'http://');
			}

			resolve(url);
		});
	});
};
// 更新素材
Wechat.prototype.updateMaterial = function(mediaId, news){
	let that = this,
		form = {
			media_id: mediaId
		};
	_.extend(form, news);
	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = api.permanent.update + "access_token="+data.access_token+"&media_id="+mediaId;

			request({method: 'POST', url: url, body: form, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('update materials failed');
				}
			})
			.catch(function(err){
				reject(err)
			});	
		});
	});
};
module.exports=Wechat;