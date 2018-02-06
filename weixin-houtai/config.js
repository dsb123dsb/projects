'user strict'

const path = require('path');
const sha1 = require('sha1');
const util = require('./libs/util');

let wechat_file = path.join(__dirname, './config/wechat.txt');
let wechat_ticket_file = path.join(__dirname, './config/wechat_ticket.txt');
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
		},
		getTicket: function(){
			return util.readFileAsync(wechat_ticket_file);
		},
		saveTicket: function(data){
			data = JSON.stringify(data);

			return util.writeFileAsync(wechat_ticket_file, data);
		},
	}
};

module.exports = config;