'user strict'
const path = require('path');
const config = require('../config');
const Wechat = require('../wechat/wechat');
const menu = require('./menu');
const wechatApi = new Wechat(config.wechat);

wechatApi.deleteMenu().then(function(){
	return wechatApi.createMenu(menu);
})
.then(function(msg){
	console.log(msg);
});
exports.reply = function* (next){
	let message = this.weixin;
	console.log(message);
	if(message.MsgType === 'event'){
		if(message.Event === 'subscribe'){
			if(message.EventKey){
				console.log('扫二维码进来： '+ message.EventKey + ' ' + message.ticket);
			}
			this.body = '哈哈，你订阅了zyh';
		}
		else if (message.Event === 'unsubscribe'){
			console.log('无情取关');
			this.body = '';
		}
		else if(message.Event === 'LOCATION'){
			this.body = '您上报的位置是： ' + message.Latitude + '/' + message.Longitude + message.Precision;
		}
		else if(message.Event === 'CLICK'){
			this.body = '您点击了菜单： ' + message.EventKey;
		}
		else if(message.Event === 'SCAN'){
			console.log('关注后扫二维码' + message.EventKey + ' ' + Ticket);
		}else if(message.Event === 'VIEW'){
			this.body = '您点击了菜单中的链接: ' + message.EventKey;
		}else if(message.Event === 'scancode_push'){
			console.log(message.ScanCodeInfo.ScanType);
			console.log(message.ScanCodeInfo.ScanResult);
			this.body = '您点击了菜单中 : ' + message.EventKey;
		}else if(message.Event === 'scancode_waitmsg'){
			console.log(message.ScanCodeInfo.ScanType);
			console.log(message.ScanCodeInfo.ScanResult);
			this.body = '您点击了菜单中 : ' + message.EventKey;
		}else if(message.Event === 'pic_sysphoto'){
			console.log(message.SendPicsInfo.Piclist);
			console.log(message.SendPicsInfo.Count);
			this.body = '您点击了菜单中 : ' + message.EventKey;
		}else if(message.Event === 'pic_photo_or_album'){
			console.log(message.SendPicsInfo.Piclist);
			console.log(message.SendPicsInfo.Count);
			this.body = '您点击了菜单中 : ' + message.EventKey;
		}else if(message.Event === 'pic_weixin'){
			console.log(message.SendPicsInfo.Piclist);
			console.log(message.SendPicsInfo.Count);
			this.body = '您点击了菜单中 : ' + message.EventKey;
		}else if(message.Event === 'location_select'){
			console.log(message.SendLocationInfo.Location_X);
			console.log(message.SendLocationInfo.Location_Y);
			console.log(message.SendLocationInfo.Scale);
			console.log(message.SendLocationInfo.Label);
			console.log(message.SendLocationInfo.Poiname);
			this.body = '您点击了菜单中 : ' + message.EventKey;
		}
	}else if(message.MsgType === 'text'){
		let content = message.Content,
			reply = '额， 你说的： ' + message.Content + ' 太复杂了';
		if(content === '1'){
			reply = 'zyh最帅！！';
		}else if(content === '2'){
			reply = 'zyh最最帅！！';
		}else if(content === '3'){
			reply = 'zyh最最最帅！！';
		}else if(content === '4'){
			reply = [{
				title: 'zyh最帅！',
				description: '真帅',
				picUrl: 'http://img.blog.csdn.net/20160715204332491',
				url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
			}];
		}else if(content === '5'){
			let data = yield wechatApi.updloadMaterial('image', path.join(__dirname,'../2.jpg'));
			reply = {
				type: 'image',
				title: 'zyh图片',
				description: 'zyh最帅！！',
				mediaId: data.media_id

			};
		}else if(content === '6'){ // there has problem
			let data = yield wechatApi.updloadMaterial('video', path.join(__dirname,'../6.mp4'));
			reply = {
				type: 'video',
				title: 'zyh回复视频',
				description: 'zyh最帅！！',
				mediaId: data.media_id
			};
		}else if(content === '7'){
			let data = yield wechatApi.updloadMaterial('image', path.join(__dirname,'../2.jpg'));
			reply = {
				type: 'music',
				title: 'zyh回复音乐',
				description: 'zyh最帅！！',
				musicUrl: 'http://music.163.com/#/song?id=114024',
				thumMediaId: data.media_id
			};
		}else if(content === '8'){
			let data = yield wechatApi.updloadMaterial('image', path.join(__dirname,'../2.jpg'), {type: 'image'});
			reply = {
				type: 'image',
				title: 'zyh永久图片',
				description: 'zyh最帅！！',
				mediaId: data.media_id

			};
		}else if(content === '9'){
			let data = yield wechatApi.updloadMaterial('video', path.join(__dirname,'../6.mp4'), {type: 'video', description: '{"title": "really a nice place","introduction": "never think" }'});
			// console.log(data);
			reply = {
				type: 'video',
				title: 'zyh回复永久视频',
				description: 'zyh最帅！！',
				mediaId: data.media_id
			};
		}else if(content === '10'){
			let picData = yield wechatApi.updloadMaterial('image', path.join(__dirname,'../2.jpg'), {});
			// console.log(data);
			let media = {
				articles: [{
					title: 'haha',
					thumb_media_id: picData.media_id,
					author: 'zyh',
					digest: '没有摘要',
					show_cover_pic: 1,
					content: '没有内容',
					content_source_url: 'http://github.com'
				},{
					title: 'haha2',
					thumb_media_id: picData.media_id,
					author: 'zyh',
					digest: '没有摘要',
					show_cover_pic: 0,
					content: '没有内容',
					content_source_url: 'http://github.com'
				}]
			};

			data = yield wechatApi.updloadMaterial('news', media, {});
			data = yield wechatApi.fetchMaterial(data.media_id,'news', {});
			// console.log(data);

			let items = data.news_item,
				news = [];

			items.forEach(function(item){
				news.push({
					title: item.title,
					description: item.digest,
					picUrl: picData.url,
					url: item.url
				});
			});
			reply = news;
		}else if(content ==='11'){
			let counts = yield wechatApi.countMaterial();

			console.log(JSON.stringify(counts));

			let results = yield [
				wechatApi.batchMaterial({
					type: 'image',
					offset: 0,
					count: 10
				}),
				wechatApi.batchMaterial({
					type: 'video',
					offset: 0,
					count: 10
				}),
				wechatApi.batchMaterial({
					type: 'voice',
					offset: 0,
					count: 10
				}),
				wechatApi.batchMaterial({
					type: 'news',
					offset: 0,
					count: 10
				}),
			];
			console.log(JSON.stringify(results));
			reply = '1';
		}else if(content ==='12'){
			let tag = yield wechatApi.createTag('zyh3');
			console.log('新标签 zyh: ');
			console.log(tag);

			let tags = yield wechatApi.fetchTags();
			console.log('已有标签： ');
			console.log(tags);

			let batchtag = yield wechatApi.batchTag([message.FromUserName], 101);

			let zyhCount = yield wechatApi.fetchCount(100);
			console.log('标签id 100下粉丝数量：')
			console.log(zyhCount);

			let result = yield wechatApi.updateTag(100, 'zyh100');
			console.log('100 zyh 改名为 zyh100');
			console.log(result);

			let result2 = yield wechatApi.deleteTag(102);
			console.log('删除102 zyh3');
			console.log(result2);

			let tags2 = yield wechatApi.fetchTags();
			console.log('改动后标签： ');
			console.log(tags2);

			reply = 'tag done!';
		}else if(content ==='13'){
			let user = yield wechatApi.fetchUsers(message.FromUserName, 'en');
			console.log(user);

			let openIds = [{
				openid: message.FromUserName,
				lang: 'en'
			}];

			let users =  yield wechatApi.fetchUsers(openIds);
			console.log(users);

			reply = JSON.stringify(user);
		}else if(content ==='14'){
			let userlst = yield wechatApi.listUsers();

			console.log(userlst);

			reply = userlst.total;
		}else if(content ==='15'){
			let mpnews = { // 没有权限
				media_id: 'ywUstwhmFKQ3klFZLaGhSQOWbPIFugz0Grpl8BiyqVw'
			}

			let text = {
				content: 'Hello Wechat'
			}
			// let msgData = yield wechatApi.sendByTag('mpnews', mpnews, 100);
			let msgData = yield wechatApi.sendByTag('text', text, 100);

			console.log(msgData);

			reply = 'ai';
		}else if(content ==='16'){
			let mpnews = {
				media_id: 'ywUstwhmFKQ3klFZLaGhSQOWbPIFugz0Grpl8BiyqVw'
			}

			let text = {
				content: 'Hello Wechat'
			}
			// let msgData = yield wechatApi.sendByTag('mpnews', mpnews, message.FromUserName);
			let msgData = yield wechatApi.previewMass('text', text, message.FromUserName);

			console.log(msgData);

			reply = 'ai';
		}else if(content ==='17'){
			let msgData = yield wechatApi.checkMass(1000000001);

			console.log(msgData);

			reply = 'ai';
		}else if(content ==='18'){
			let temQr = {
				expire_seconds: 604800,
				action_name: 'QR_SCENE',
				action_info: {
					scene: {
						scene_id: 123
					}
				}
			};
			let temStrQr = {
				expire_seconds: 604800,
				action_name: 'QR_STR_SCENE',
				action_info: {
					scene: {
						scene_str: 'test'
					}
				}
			};
			let permQr = {
				action_name: 'QR_LIMIT_SCENE',
				action_info: {
					scene: {
						scene_id: 123
					}
				}
			};
			let permStrQr = {
				action_name: 'QR_LIMIT_STR_SCENE',
				action_info: {
					scene: {
						scene_str: 'test'
					}
				}
			};

			let qr1 = yield wechatApi.createQrcode(temQr);
			let qr2 = yield wechatApi.createQrcode(temStrQr);
			let qr3 = yield wechatApi.createQrcode(permQr);
			let qr4 = yield wechatApi.createQrcode(permStrQr);

			console.log(qr2);

			reply = 'ai';
		}else if(content === '19'){
			let longUrl = 'http://github.com';

			let shortData = yield wechatApi.createShorturl(null, longUrl);
			
			console.log(shortData);
			reply = shortData.short_url;
		}else if(content === '20'){
			let  semanticData= {
				query: 'zyh大电影',
				city: '杭州',
				category: 'movie',
				appid: 'wxaaaaaaaaaaaaaaaa',
				uid: message.FromUserName
			};

			let _semanticData = yield wechatApi.semantic(semanticData);
			
			reply = JSON.stringify(semanticData);
		}
		this.body = reply;
	}

	yield next;
}