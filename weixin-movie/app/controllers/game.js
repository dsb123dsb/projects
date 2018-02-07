'use strict'

const ejs = require('ejs');
const heredoc = require('heredoc');
const crypto = require('crypto');
// 安全域名也要改
let tpl = heredoc(function(){/*
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1">
	<title>搜电影</title>
</head>
	<body>
		<h1>点击标题，开始录音</h1>
		<p id = "title"></p>
		<div id = "director"></div>
		<div id = "year"></div>
		<div id = "poster"></div>
		<script src="http://zeptojs.com/zepto-docs.min.js"></script>
		<script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
		<script>
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: 'wxc0d5cd93a341a641', // 必填，公众号的唯一标识
			    timestamp: '<%= timestamp %>', // 必填，生成签名的时间戳
			    nonceStr: '<%= nonceStr %>', // 必填，生成签名的随机串
			    signature: '<%= signature %>',// 必填，签名
			    jsApiList: [
					'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'
			    ] // 必填，需要使用的JS接口列表
			});
			wx.ready(function(){
				wx.checkJsApi({ // 判断当前客户端版本是否支持指定JS接口
				    jsApiList: ['onVoiceRecordEnd'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
				    success: function(res) {
				    	// console.log(res);
				    }
				});

				let shareContent = {												
						title: 'title', 
						desc: '我搜电影',
						link: 'http://1b14fef7.ngrok.io/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
						success: function () {
							window.alert('分享成功');
						},
						cancel: function () {
							window.alert('分享失败');
						}
				};
				wx.onMenuShareAppMessage(shareContent);
				let slides;
				let isRecording = false;

				$('#poster').on('tap', function(){
					wx.previewImage(slides);
				})
				$('h1').on('tap', function(){
					if(!isRecording){
						isRecording = true;
						wx.startRecord({
							cancel: function(){
								window.alert('那就不撸直了');
							}
						});
						return
					}
					isRecording = false; // 停止录音
					wx.stopRecord({
						success: function(res){
							let localId = res.localId;
							wx.translateVoice({
								localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
								isShowProgressTips: 1, // 默认为1，显示进度提示
								success: function (res) {
									let result=res.translateResult; // 语音识别的结果
									$.ajax({
										type: 'get',
										url: 'https://api.douban.com/v2/movie/search?q='+result,
										dataType: 'jsonp',
										jsonp: 'callback',
										success: function(data){
											console.log(data);
											let subject = data.subjects[0];
											$('#title').html(subject.title);
											$('#year').html(subject.year);
											$('#director').html(subject.directors[0].name);
											$('#poster').html('<image src="'+subject.images.large+'" />');
											shareContent = {
												title: subject.title, 
												desc: '我搜出来了电影'+ subject.title,
												link: 'http://1b14fef7.ngrok.io/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
												imgUrl: subject.images.large,
												type: 'link', // 分享类型,music、video或link，不填默认为link
												dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
												success: function () {
													window.alert('分享成功');
												},
												cancel: function () {
													window.alert('分享失败');
												}
											}

											slides = {
												current: subject.images.large, 
												urls: [] // 
											};
											data.subjects.forEach(function(item){
												slides.urls.push(item.images.large);
											})
								
											wx.onMenuShareAppMessage(shareContent);

										}
									})
								}
							});
						}
					});
				})
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
	let str = params.sort().join('&'); // 忘记加分隔符，你麻痹，浪费两个小时

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
const wx = require('../../wx/index');
exports.movie = async function (ctx, next){	// koa router7对于异步处理有问题，可用promise处理,，更可拥抱 async await
	let wechatApi = wx.getWechat();
	let data = await wechatApi.fetchAccesssToken();
	let access_token = data.access_token;
	let ticketData = await wechatApi.fetchTicket(access_token);
	let ticket = ticketData.ticket;
	let url = ctx.href;
	let params = sign(ticket, url);
	ctx.body = ejs.render(tpl, params);
};