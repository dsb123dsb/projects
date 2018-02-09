'use strict'

const util = require('../../libs/util')
const wx = require('../../wx/index');
const Movie = require('../api/movie');

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
exports.find = async function (ctx, next){	// koa router7对于异步处理有问题，可用promise处理,，更可拥抱 async await
	let id = ctx.params.id;
	let wechatApi = wx.getWechat();
	let data = await wechatApi.fetchAccesssToken();
	let access_token = data.access_token;
	let ticketData = await wechatApi.fetchTicket(access_token);
	let ticket = ticketData.ticket;
	let url = ctx.href;
	let params = util.sign(ticket, url);
	let movie = await Movie.searchById(id);
	params.movie = movie;

	await ctx.render('wechat/movie', params);
};