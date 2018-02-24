'use strict'

const wechat = require('../../wechat/g');
const reply = require('../../wx/reply');
const wx = require('../../wx/index');

exports.hear = async function(ctx, next){
	console.log(ctx)
	ctx.middle = wechat(wx.wechatOptions.wechat, reply.reply);
	
	await ctx.middle(next);
}