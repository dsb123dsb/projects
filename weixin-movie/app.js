'use strict'

const Koa = require('koa');
const views = require('koa-views');
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
const router = new Router();
const game = require('./app/controllers/game');
const wechat = require('./app/controllers/wechat');

router.get('/movie', game.movie);
router.get('/wx', wechat.hear); // 监听来自微信的请求
router.post('/wx', wechat.hear);

app.use(views(__dirname + '/app/views', {
  extension: 'pug'
}));
app
.use(router.routes())
.use(router.allowedMethods());

app.listen(3000);
console.log('Listening: 3000')