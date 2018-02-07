'use strict'
/*中间件*/

const sha1 = require('sha1');
const getRawBody = require('raw-body'); // 解析http的requset对象为buffer的XML数据
const util = require('./util.js');
const Wechat = require('./wechat');

module.exports = function(opts, handler){
	let wechat =new Wechat(opts);

	return async function (next){
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
				let data = await getRawBody(this.req, {
					length: this.length,
					limit: 'lmb',
					encoding: this.charset
				});
				// console.log(data.toString())

				let content = await util.parseXMLAsync(data);
				// console.log(content);
				let message = util.formatMessage(content.xml); // 解析微信服务端消息格式化
				// console.log(message);
				this.weixin = message;

				await handler.call(this, next); // 进行下一步中间件处理
				wechat.reply.call(this);

			}			
		}
	};
};
