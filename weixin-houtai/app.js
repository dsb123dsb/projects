'use strict'

const Koa = require('koa');
const path = require('path');
const sha1 = require('sha1');
const wechat = require('./wechat/g');
const util = require('./libs/util');
const config = require('./config');
const weixin = require('./weixin');

let wechat_file = path.join(__dirname, './config/wechat.txt');


let app = new Koa();

app.use(wechat(config.wechat, weixin.reply));

app.listen(3000);
console.log('Listening: 3000')