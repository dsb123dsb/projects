'user strict'

const path = require('path');
const wx = require('./index');
const Movie = require('../app/api/movie');
let wechatApi = wx.getWechat();

exports.reply = async function (next){
	let message = this.weixin;
	console.log(message);
	if(message.MsgType === 'event'){
		if(message.Event === 'subscribe'){
			this.body = '哈哈，你订阅了zyh,欢迎关注科幻电影\n'+
				'回复1~3, 测试文字回复\n'+
				'回复4, 测试图文回复\n'+
				'回复首页, 进入电影首页\n'+
				'回复登陆, 进入微信登陆绑定\n'+
				'回复游戏, 进入游戏页面\n'+
				'回复电影名字, 查询电影信息\n'+
				'回复 语言, 查询电影信息\n'+
				'也可以点击 <a href="http://1b14fef7.ngrok.io/movie">语音查电影</a>';
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
	}else if (message.MsgType === 'voice') {
	    let voiceText = message.Recognition; // 解析后语音结果为空
	    let movies = await Movie.searchByName(voiceText);

	    if (!movies || movies.length === 0) {
	      movies = await Movie.searchByDouban(voiceText);
	    }

	    if (movies && movies.length > 0) {
	      reply = [];

	      movies = movies.slice(0, 8);
	      
	      movies.forEach(function(movie) {
	        reply.push({
                title: movie.title,
                description: movie.title,
                picUrl: movie.poster,
                url: 'http://28b1bb3c.ngrok.io/wechat/jump/' + movie._id
	        });
	      });

	    }else {
	      reply = '没有查询到与 ' + voiceText + ' 匹配的电影，要不要换一个名字试试'
	    }
		this.body = reply;
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
			let data = await wechatApi.updloadMaterial('image', path.join(__dirname,'../2.jpg'));
			reply = {
				type: 'image',
				title: 'zyh图片',
				description: 'zyh最帅！！',
				mediaId: data.media_id

			};
		}else if(content === '6'){ // there has problem
			let data = await wechatApi.updloadMaterial('video', path.join(__dirname,'../6.mp4'));
			reply = {
				type: 'video',
				title: 'zyh回复视频',
				description: 'zyh最帅！！',
				mediaId: data.media_id
			};
		}else if(content === '7'){
			let data = await wechatApi.updloadMaterial('image', path.join(__dirname,'../2.jpg'));
			reply = {
				type: 'music',
				title: 'zyh回复音乐',
				description: 'zyh最帅！！',
				musicUrl: 'http://music.163.com/#/song?id=114024',
				thumMediaId: data.media_id
			};
		}else if(content === '8'){
			let data = await wechatApi.updloadMaterial('image', path.join(__dirname,'../2.jpg'), {type: 'image'});
			reply = {
				type: 'image',
				title: 'zyh永久图片',
				description: 'zyh最帅！！',
				mediaId: data.media_id

			};
		}else if(content === '9'){
			let data = await wechatApi.updloadMaterial('video', path.join(__dirname,'../6.mp4'), {type: 'video', description: '{"title": "really a nice place","introduction": "never think" }'});
			// console.log(data);
			reply = {
				type: 'video',
				title: 'zyh回复永久视频',
				description: 'zyh最帅！！',
				mediaId: data.media_id
			};
		}else if(content === '10'){
			let picData = await wechatApi.updloadMaterial('image', path.join(__dirname,'../2.jpg'), {});
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

			data = await wechatApi.updloadMaterial('news', media, {});
			data = await wechatApi.fetchMaterial(data.media_id,'news', {});
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
			let counts = await wechatApi.countMaterial();

			console.log(JSON.stringify(counts));

			let results = await [
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
			let tag = await wechatApi.createTag('zyh3');
			console.log('新标签 zyh: ');
			console.log(tag);

			let tags = await wechatApi.fetchTags();
			console.log('已有标签： ');
			console.log(tags);

			let batchtag = await wechatApi.batchTag([message.FromUserName], 101);

			let zyhCount = await wechatApi.fetchCount(100);
			console.log('标签id 100下粉丝数量：')
			console.log(zyhCount);

			let result = await wechatApi.updateTag(100, 'zyh100');
			console.log('100 zyh 改名为 zyh100');
			console.log(result);

			let result2 = await wechatApi.deleteTag(102);
			console.log('删除102 zyh3');
			console.log(result2);

			let tags2 = await wechatApi.fetchTags();
			console.log('改动后标签： ');
			console.log(tags2);

			reply = 'tag done!';
		}else if(content ==='13'){
			let user = await wechatApi.fetchUsers(message.FromUserName, 'en');
			console.log(user);

			let openIds = [{
				openid: message.FromUserName,
				lang: 'en'
			}];

			let users =  await wechatApi.fetchUsers(openIds);
			console.log(users);

			reply = JSON.stringify(user);
		}else if(content ==='14'){
			let userlst = await wechatApi.listUsers();

			console.log(userlst);

			reply = userlst.total;
		}else if(content ==='15'){
			let mpnews = { // 没有权限
				media_id: 'ywUstwhmFKQ3klFZLaGhSQOWbPIFugz0Grpl8BiyqVw'
			}

			let text = {
				content: 'Hello Wechat'
			}
			// let msgData = await wechatApi.sendByTag('mpnews', mpnews, 100);
			let msgData = await wechatApi.sendByTag('text', text, 100);

			console.log(msgData);

			reply = 'ai';
		}else if(content ==='16'){
			let mpnews = {
				media_id: 'ywUstwhmFKQ3klFZLaGhSQOWbPIFugz0Grpl8BiyqVw'
			}

			let text = {
				content: 'Hello Wechat'
			}
			// let msgData = await wechatApi.sendByTag('mpnews', mpnews, message.FromUserName);
			let msgData = await wechatApi.previewMass('text', text, message.FromUserName);

			console.log(msgData);

			reply = 'ai';
		}else if(content ==='17'){
			let msgData = await wechatApi.checkMass(1000000001);

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

			let qr1 = await wechatApi.createQrcode(temQr);
			let qr2 = await wechatApi.createQrcode(temStrQr);
			let qr3 = await wechatApi.createQrcode(permQr);
			let qr4 = await wechatApi.createQrcode(permStrQr);

			console.log(qr2);

			reply = 'ai';
		}else if(content === '19'){
			let longUrl = 'http://github.com';

			let shortData = await wechatApi.createShorturl(null, longUrl);
			
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

			let _semanticData = await wechatApi.semantic(semanticData);
			
			reply = JSON.stringify(semanticData);
		}else {
	        var movies = await Movie.searchByName(content);

	        if (!movies || movies.length === 0) {
	           movies = await Movie.searchByDouban(content);
	        }
	        if (movies && movies.length > 0) {
	            reply = [];

	            movies = movies.slice(0, 8); // 目前最多八条，多了将无响应

	            movies.forEach(function(movie) {
	                reply.push({
		                title: movie.title,
		                description: movie.title,
		                picUrl: movie.poster,
		                url: 'http://28b1bb3c.ngrok.io/wechat/jump/' + movie._id
	            	});
	        	});
	        }else {
	        	reply = '没有查询到与 ' + content + ' 匹配的电影，要不要换一个名字试试'
	        }
	    }

		this.body = reply;
	}

	await next;
}