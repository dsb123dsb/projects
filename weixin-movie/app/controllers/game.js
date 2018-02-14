'use strict'

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Comment = mongoose.model('Comment');
const util = require('../../libs/util');
const wx = require('../../wx/index');
const Movie = require('../api/movie');
const request = require('request');

exports.guess = async function (ctx, next){	// koa router7对于异步处理有问题，可用promise处理,，更可拥抱 async await
	let wechatApi = wx.getWechat();
	let data = await wechatApi.fetchAccesssToken();
	let access_token = data.access_token;
	let ticketData = await wechatApi.fetchTicket(access_token);
	let ticket = ticketData.ticket;
	let url = ctx.href;
	let params = util.sign(ticket, url);
	await ctx.render('wechat/game', params);
};

exports.jump = async function (ctx, next) {
  let movieId = ctx.params.id;
  let redirect = encodeURIComponent('http://28b1bb3c.ngrok.io/wechat/movie/' + movieId);
  let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wx.wechatOptions.appId + '&redirect_uri=' + redirect + '&response_type=code&scope=snsapi_base&state=' + movieId + '#wechat_redirect';

  ctx.redirect(url);
};

exports.find = async function (ctx, next){	// koa router7对于异步处理有问题，可用promise处理,，更可拥抱 async await
	let code = ctx.query.code;
	let openUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + options.appID + '&secret=' + options.appSecret + '&code=' + code + '&grant_type=authorization_code';
	// 获取用户信息需要在微信上填写请求域名
	let response = await request({
	    url: openUrl
	  });
	let body = JSON.parse(response.body);
	let openid = body.openid;
	let user = await User.findOne({openid: openid}).exec();

	if (!user) {
	  user = new User({
	    openid: openid,
	    password: 'zyh',
	    name: Math.random().toString(36).substr(2)
	  });

	  user = await user.save();
	}

	ctx.session.user = user;
	ctx.state.user = user;

	let id = ctx.params.id;
	let wechatApi = wx.getWechat();
	let data = await wechatApi.fetchAccesssToken();
	let access_token = data.access_token;
	let ticketData = await wechatApi.fetchTicket(access_token);
	let ticket = ticketData.ticket;
	let url = ctx.href;
	let params = util.sign(ticket, url);
	let movie = await Movie.searchById(id);
	let comments = yield Comment
	    .find({movie: id})
	    .populate('from', 'name')
	    .populate('reply.from reply.to', 'name')
	    .exec();

	params.comments = comments
	params.movie = movie;

	await ctx.render('wechat/movie', params);
};