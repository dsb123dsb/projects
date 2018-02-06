'use strict'

const Koa = require('koa');
const path = require('path');
const sha1 = require('sha1');
const ejs = require('ejs');
const heredoc = require('heredoc');
const crypto = require('crypto');

const wechat = require('./wechat/g');
const Wechat = require('./wechat/wechat');
const util = require('./libs/util');
const config = require('./config');
const reply = require('./wx/reply');


let app = new Koa();

let tpl = heredoc(function(){/*
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="initial-scale=1, maximum-scalw=1, minimum-scale=1">
	<title>猜电影</title>
</head>
	<body>
		<h1>点击标题，开始录音</h1>
		<p id = "title"></p>
		<div id = "poster"></div>
		<script sr="https://cdnjs.cloudflare.com/ajax/libs/zepto/1.2.0/zepto.min.js"></script>
		<script sr="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
		<script>
			wx.config({
			    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: 'wxc0d5cd93a341a641', // 必填，公众号的唯一标识
			    timestamp: '<%= timestamp %>', // 必填，生成签名的时间戳
			    nonceStr: ''<%= nonceStr %>'', // 必填，生成签名的随机串
			    signature: ''<%= signature %>'',// 必填，签名
			    jsApiList: [
					'startRecord',
					'stopRecord',
					'onVoiceRecordEnd',
					'playVoice',
					'pauseVoice',
					'stopVoice',
					'onVoicePlayEnd',
					'uploadVoice',
					'downloadVoice',
					'chooseImage',
					'previewImage',
					'uploadImage',
					'downloadImage',
					'translateVoice'
			    ] // 必填，需要使用的JS接口列表
			});
		</script>
	</body>
</html>
*/});
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
	let str = params.sort().join('');
	let shasum = crypto.createHash('sha1');

	shasum.update(str);
	return shasum.digest('hex');
}
function sign(ticket, url){
	let nonceStr = createNonce(),
		timestamp = createTimestamp(),
		signature = _sign(nonceStr, ticket, timestamp, url);

		return {
			nonceStr: nonceStr,
			timestamp: timestamp,
			signature: signature
		};
}

app.use(function *(next){
	if(this.url.indexOf('/movie')>-1){
		let wechatApi = new Wechat(config.wechat);
		let data = yield wechatApi.fetchAccesssToken();
		let access_token = data.access_token;
		let ticketData = yield wechatApi.fetchTicket(access_token);
		let ticket = ticketData.ticket;
		let url = this.href;
		let params = sign(ticket, url);

		console.log(params);
		this.body = ejs.render(tpl, params);

		return next;
	}
});

app.use(wechat(config.wechat, reply.reply));

app.listen(3000);
console.log('Listening: 3000')