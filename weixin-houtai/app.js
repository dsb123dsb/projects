const Koa = require('koa');
const sha1 = require('sha1');
const config = {
	wechat:{
		appId: 'wx72dc9f892d6fa1e9',
		appSecret: '1a8dce13481068454fb519a06d465693',
		token: 'zyhsite'
	}
};

let app = new Koa();

app.use(function *(next){
	console.log(this.query);

	let token = config.wechat.token,
		signature = this.query.signature,
		nonce = this.query.nonce,
		timestamp = this.query.timestamp,
		echostr = this.query.echostr,
		str = [token, timestamp, nonce].sort().join(''),
		sha = sha1(str);

	if(sha === signature){
		this.body = echostr + '';
	}else{
		this.body = 'wrong';
	}
});

app.listen(3000);
console.log('Listening: 3000')