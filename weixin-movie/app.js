'use strict'

const Koa = require('koa');
const path = require('path');
const fs = require('fs');

const mongoose = require('mongoose');
const dbURL = 'mongodb://localhost/node-mongodb_website'; // 连接数据库

mongoose.connect(dbURL);
// models loading
let models_path = __dirname + '/app/models';
fs.readdirSync(models_path)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(path.join(models_path, file)));

const menu = require('./wx/menu');
const wx = require('./wx/index');
let wechatApi = wx.getWechat();

wechatApi.deleteMenu().then(function(){
	return wechatApi.createMenu(menu);
})
.then(function(msg){
	console.log(msg);
});

const app = new Koa();
const Router = require('koa-router');
const session = require('koa-session');// 利用cookie存储会话状态
const bodyParser = require('koa-bodyparser');
const router = new Router();
const User = mongoose.model('User');
const views = require('koa-views');
const moment = require('moment');

app.use(views(__dirname + '/app/views', {
  extension: 'pug',
  locals: {
  	moment: moment
  }
}));

app.keys=['zyh'];
app.use(session(app));
app.use(bodyParser());

app.use(async (ctx, next) => {
  let user = ctx.session.user;

  if (user && user._id) {
    ctx.session.user = await User.findOne({_id: user._id}).exec();
    ctx.state.user = ctx.session.user;
  }
  else {
    ctx.state.user = null;
  }

  await next();
})

require('./config/routes')(router);

app
.use(router.routes())
.use(router.allowedMethods());

app.listen(3000);
console.log('Listening: 3000');