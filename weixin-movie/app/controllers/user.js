const User = require('../models/users');

// showSignup page
exports.showSignup = function(req,res){
	res.render('signup', {
		title: '注册页面'
	});
};
// showSignin page
exports.showSignin = function(req,res){
	res.render('signin', {
		title: '登陆页面'
	});
};
// singn up 注册
exports.signup = function(req, res){
	let _user = req.body.user;
	// /user/signup/:useerId?useerId=1122;
	// 三种获取userId，1.req.params.userid, 2.req.body.userid 3.req.query.useerid,  若直接使用req.param('userid'),会从123按顺序找

	// 查找是或否用户名已存在
	User.find({name:_user.name}, (err, user)=>{ // find返回的是数组
		if(err){
			console.log(err);
		}
		if(user&&user.length){
			return res.redirect('/signin');
		}
		else{
			user = new User(_user);
			user.save((err, user)=>{
				if(err){
					console.log(err);
				}else{
					console.log(user);
					res.redirect('/');
				}
			})	
		}
	})

};

// signin 登陆
exports.signin = function(req,res){
	let _user= req.body.user;
	let name = _user.name;
	let password = _user.password;

	User.findOne({name:name}, (err,user)=>{
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/signup');
		}
		// compare password
		user.comparePassword(password, (err, isMatched)=>{
			if(err){
				console.log(err);
			}
			if(isMatched){
				req.session.user = user; // 写入session,不做处理重启服务就消失了
				// console.log("Password is matched");
				return	res.redirect('/');
			}else{
				return res.redirect('/signin');
				console.log("Password is not matched");
			}
		});
	});
};

// logout
exports.logout = function(req,res){
	delete req.session.user;
	// delete app.locals.user
	res.redirect('/');
};
// userlist page
exports.list = function(req,res){
	User.fetch((err ,users) => {
		if(err){
			console.log(err);
		}
		res.render('userlist', {
			title: 'zhou\'site user列表页',
			users: users
		});

	});
};

// middware for user
exports.signinRequired = function(req,res,next){
	let user = req.session.user;

	if(!user){
		return res.redirect('/signin');
	}
	next();
};
// middware for admin
exports.adminRequired = function(req,res,next){
	let user = req.session.user;

	if(user.role<=10 || !user.role){
		return res.redirect('/signin');
	}
	next();
};