'use strict'

const Koa = require('koa');
const path = require('path');
const sha1 = require('sha1');
const wechat = require('./wechat/g');
const util = require('./libs/util');

let wechat_file = path.join(__dirname, './config/wechat.txt');
const config = {
	wechat:{
		appId: 'wx72dc9f892d6fa1e9',
		appSecret: '1a8dce13481068454fb519a06d465693',
		token: 'zyhsite',
		getAccessToken: function(){
			return util.readFileAsync(wechat_file);
		},
		saveAccessToken: function(data){
			data = JSON.stringify(data);

			return util.writeFileAsync(wechat_file, data);
		}
	}
};

let app = new Koa();

app.use(wechat(config.wechat));

app.listen(3000);
console.log('Listening: 3000')