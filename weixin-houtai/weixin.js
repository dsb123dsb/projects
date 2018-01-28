'user strict'

exports.reply = function* (next){
	let message = this.weixin;

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
		}
		this.body = reply;
	}

	yield next;
}