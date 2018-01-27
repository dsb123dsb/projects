'use strict'

const sha1 = require('sha1');
const getRawBody = require('raw-body'); // 解析http的requset对象为buffer的XML数据
const util = require('./util.js');
const Wechat = require('./wechat');

module.exports = function(opts){
	let wechat =new Wechat(opts);

	return function *(next){
		// console.log(this.query);
		let that = this;
		let token = opts.token,
			signature = this.query.signature,
			nonce = this.query.nonce,
			timestamp = this.query.timestamp,
			echostr = this.query.echostr,
			str = [token, timestamp, nonce].sort().join(''),
			sha = sha1(str);
		if(this.method === "GET"){
			if(sha === signature){
				this.body = echostr + '';
			}else{
				this.body = 'wrong';
			}
		}else if(this.method === "POST"){
			if(sha !== signature){
				this.body = 'wrong';

				return false;
			}else{
				let data = yield getRawBody(this.req, {
					length: this.length,
					limit: 'lmb',
					encoding: this.charset
				});
				// console.log(data.toString())

				let content = yield util.parseXMLAsync(data);
				// console.log(content);
				let message = util.formatMessage(content.xml);
				// console.log(message);
				if(message.MsgType === 'event'){
					if((message.Event) === 'subscribe'){
						let now = new Date().getTime();

						that.status = 200;
						that.type = 'application/xml';
						// 注意i空格什么的
						that.body = '<xml>'+
							'<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+ 
								'<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+'<CreateTime>'+now+'</CreateTime><MsgType><![CDATA[text]]></MsgType> <Content><![CDATA[Hi, zyh]]></Content>'+'</xml>';
						return
					}
				}
			}			
		}
	};
};
