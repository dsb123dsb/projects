'use strict'

const Koa = require('koa');
const path = require('path');
const sha1 = require('sha1');
const wechat = require('./wechat/g');
const util = require('./libs/util');

let wechat_file = path.join(__dirname, './config/wechat.txt');
const config = {
	wechat:{
		appId: 'wxc0d5cd93a341a641',
		appSecret: '703b5f43bf50f9e22cdf683fc6ca1825',
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