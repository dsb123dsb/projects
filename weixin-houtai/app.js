'use strict'

const Koa = require('koa');
const path = require('path');
const sha1 = require('sha1');
const wechat = require('./wechat/g');
const util = require('./libs/util');
const config = require('./config');
const reply = require('./wx/reply');

let app = new Koa();

app.use(wechat(config.wechat, reply.reply));

app.listen(3000);
console.log('Listening: 3000')