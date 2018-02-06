'use strict'
/*token验证*/

const Promise = require('bluebird');
const _ = require('lodash');
const request = Promise.promisify(require('request'));
const fs = require('fs');
const util = require('./util.js');

const prefix = "https://api.weixin.qq.com/cgi-bin/";
const mpPrefix = "https://mp.weixin.qq.com/cgi-bin/";

let api = {
	semanticUrl:  "https://api.weixin.qq.com/semantic/semproxy/search?",
	accessToken: prefix+"token?grant_type=client_credential",
	temporary: {
		upload: prefix+'media/upload?',
		fetch: prefix+'media/get?'
	},
	permanent: {
		upload: prefix+'material/add_material?',
		uploadNews: prefix+'material/add_news?',
		uploadNewsPic: prefix+'media/uploadimg?',
		fetch: prefix+'material/get_material?',
		del: prefix+ 'material/del_material?',
		update: prefix+'material/update_news?',
		count: prefix+'material/get_materialcount?',
		batch: prefix+'material/batchget_material?',
	},
	tag: {
		create: prefix+'tags/create?', // 创建分组
		fetch: prefix+'tags/get?', // 获取分组
		update: prefix+'tags/update?', // 更新分组
		delete: prefix+'tags/delete?', // 删除分组
		fetchcount: prefix+'user/tag/get?', // 分组下粉丝数量
		batchtag: prefix+'tags/members/batchtagging?', // 批量打标签
		batchuntag: prefix+'tags/members/batchuntagging?' // 批量删除标签
	},
	user: {
		remark:  prefix+'user/info/updateremark?',
		fetch:  prefix+'user/info?',
		batchFetch:  prefix+'user/info/batchget?',
		list:  prefix+'user/get?'
	},
	mass: {
		sendtag: prefix + 'message/mass/sendall?',
		preview: prefix + 'message/mass/preview?',
		check: prefix + 'message/mass/get?'
	},
	menu: {
		create: prefix + 'menu/create?',
		get: prefix + 'menu/get?',
		delete: prefix + 'menu/delete?',
		current: prefix + 'get_current_selfmenu_info?'
	},
	qrcode: {
		create: prefix+'qrcode/create?',
		show: mpPrefix+'showqrcode?'
	},
	shortUrl: {
		create: prefix+'shorturl?'
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
	// 需要加 return，否則后面執行返回的promise不会被会返回（嵌套函数）
	return this.getAccessToken()
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

			request(options).then(function(response){
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
Wechat.prototype.fetchMaterial = function(mediaId, type, permanent){
	let that = this,
		form = {},
		fetchUrl = api.temporary.fetch;

	if(permanent){
		fetchUrl = api.permanent.fetch;
	}

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = fetchUrl + "access_token="+data.access_token;

			let options = {
				method: 'POST', url: url, json: true
			};
			let form = {};
			if(permanent){
				form.media_id = mediaId;
				form.access_token = data.access_token;
				options.body = form;
			}else{
				if( type === 'vide'){
					url = url.replace('https://', 'http://');
				}
				url += '&media_id='+ mediaId;
			}
			if(type ==='news' || type ==='video'){
				request(options).then(function(response){
					let _data = response.body;
					if(_data){
						resolve(_data);
					}else{
						throw new Eror('fetch materials failed');
					}
				})
				.catch(function(err){
					reject(err);
				});
			}else{
				resolve(url);
			}

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
// 查询永久素材数量
Wechat.prototype.countMaterial = function(){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = api.permanent.count + "access_token="+data.access_token;

			request({method: 'GET', url: url, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('update materials failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});
};
// 批量获取永久素材
Wechat.prototype.batchMaterial = function(options){
	let that = this;

	options.type = options.type || 'image';
	options.offset = options.offset || 0;
	options.count = options.count || 10;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = api.permanent.batch + "access_token="+data.access_token;

			request({method: 'POST', url: url, body: options, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('count materials failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});
};
// 创建标签
Wechat.prototype.createTag = function(name){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = api.tag.create + "access_token="+data.access_token;
			let options = {
				tag: {
					name: name
				}
			}
			request({method: 'POST', url: url, body: options, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('create tag failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});
};
// 获取已创建标签
Wechat.prototype.fetchTags = function(){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = api.tag.fetch + "access_token="+data.access_token;

			request({method: 'GET', url: url, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('fetch tag failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});
};
// 更新已创建标签
Wechat.prototype.updateTag = function(id, name){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = api.tag.update + "access_token="+data.access_token;
			let options = {
				tag: {
					id: id,
					name: name
				}
			}
			request({method: 'POST', url: url, body: options, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('update tag failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});
};
// 删除已创建标签
Wechat.prototype.deleteTag = function(id){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = api.tag.delete + "access_token="+data.access_token;
			let options = {
				tag: {
					id: id
				}
			}
			request({method: 'POST', url: url, body: options, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('delete tag failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});
};
// 获取指定标签下粉丝数量
Wechat.prototype.fetchCount = function(tagid){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = api.tag.fetchcount + "access_token="+data.access_token;
			let options = {
				tagid: tagid
			}
			request({method: 'POST', url: url, body: options, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('delete tag failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});
};
// 批量为用户打标签
Wechat.prototype.batchTag = function(openIds, tagid){
	let that = this;
	return that.batchtaganduntag("batchtag", openIds, tagid);

};
// 批量为用户取消标签
Wechat.prototype.batchunTag = function(openIds, tagid){
	let that = this;
	return that.batchtaganduntag("batchuntag", openIds, tagid);

};
Wechat.prototype.batchtaganduntag = function(action, openIds, tagid){
	let that = this;
	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = api.tag[action] + "access_token="+data.access_token;
			let form = {
				openid_list: openIds,
				tagid: tagid 
			}
			request({method: 'POST', url: url, body: form, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror(action+' failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// 修改用户备注
Wechat.prototype.remarkUser = function(openId, remark){
	let that = this;
	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){

			let url = api.user.remark + "access_token="+data.access_token;
			let form = {
				openid: openId,
				remark: remark 
			}
			request({method: 'POST', url: url, body: form, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror(action+' failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};

// 单个或批量获取用户基本信息
Wechat.prototype.fetchUsers = function(openIds,lang){
	let that = this;

	lang = lang || 'zh_CN';

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let options = {
				json: true
			};

			if(_.isArray(openIds)){
				options.url = api.user.batchFetch + "access_token="+data.access_token;
				options.body = {
					user_list: openIds
				};
				options.method = 'POST';

			}else{
				options.url = api.user.fetch + "access_token="+data.access_token + '&openid='+openIds+'&lang='+lang;
				options.method = 'GET';
			}
			request(options).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('fetch users info failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// 用户列表
Wechat.prototype.listUsers = function(openId){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url =api.user.list + "access_token="+data.access_token;
			if(openId){
				url += '&next_openid='+openId;
			}
			request({url: url, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('list user failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// 根据标签群发消息
Wechat.prototype.sendByTag = function(type, message, tagId){
	let that = this;
	let msg = {
		filter: {},
		msgtype: type
	};

	msg[type] = message;
	if(!tagId){
		msg.filter.is_to_all = true;
	}else{
		msg.filter = {
			tag_id: tagId,
			is_to_all: false
		};
	}
	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url =api.mass.sendtag + "access_token="+data.access_token;
			request({method: 'POST', url: url, body: msg, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('sendByTag failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// 预览接口
Wechat.prototype.previewMass = function(type, message, openId){
	let that = this;
	let msg = {
		touser: openId, 
		msgtype: type
	};

	msg[type] = message;
	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url =api.mass.preview + "access_token="+data.access_token;
			request({method: 'POST', url: url, body: msg, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('preview failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// 查询群发状态接口
Wechat.prototype.checkMass = function(msgId){
	let that = this;
	let form = {
		msg_id: msgId
	};

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url =api.mass.check + "access_token="+data.access_token;
			request({method: 'POST', url: url, body: form, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('check mass failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// create menu
Wechat.prototype.createMenu = function(menu){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url =api.menu.create + "access_token="+data.access_token;
			request({method: 'POST', url: url, body: menu, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('create menu failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// get menu
Wechat.prototype.getMenu = function(){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url =api.menu.get + "access_token="+data.access_token;
			request({url: url, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('get menu failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// delete menu
Wechat.prototype.deleteMenu = function(){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url =api.menu.delete + "access_token="+data.access_token;
			request({url: url, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('delete menu failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// get current menu
Wechat.prototype.getCurrentMenu = function(){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url =api.menu.current + "access_token="+data.access_token;
			request({url: url, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('get current menu failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// create qrcode
Wechat.prototype.createQrcode = function(qr){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url =api.qrcode.create + "access_token="+data.access_token;
			request({method:'POST', url: url, body: qr, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('create qrcode failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// show qrcode
Wechat.prototype.showQrcode = function(ticket){
	return api.qrcode.show + 'ticket='+encodeURI(ticket);
};
// create shorturl
Wechat.prototype.createShorturl = function(action, longUrl){
	action = action || 'long2short';

	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url =api.shortUrl.create + "access_token="+data.access_token;

			let form = {
				action: action,
				long_url: longUrl
			};
			
			request({method:'POST', url: url, body: form, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('create shorturl failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
// 语义理解
Wechat.prototype.semantic = function(semanticData){
	let that = this;

	return new Promise((resolve, reject) => {
		that
		.fetchAccesssToken()
		.then(function(data){
			let url =api.semanticUrl + "access_token="+data.access_token;
			semanticData.appid = semanticData.appID;
			
			request({method:'POST', url: url, body: semanticData, json: true}).then(function(response){
				let _data = response.body;
				if(_data){
					resolve(_data);
				}else{
					throw new Eror('Semantic failed');
				}
			})
			.catch(function(err){
				reject(err);
			});	
		});
	});	
};
module.exports=Wechat;