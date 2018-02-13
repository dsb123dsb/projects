const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // 密码加盐
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
	name:{
		type:String,
		unique:true
	},
	password:String,

	// 0:normal user; 1:verifieed user; 2:professional user; >10:admmin; >50:super admin
	role:{
		type:Number, // use node-mongodb_website; db.users.update({"_id": ObjectId("")}, {$set:{role:51}}); db.users.find({})
		default:0
	},
	meta: {// 更新记录的状态记录
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});
// 模式方法，每次调用判断是否是新加的
UserSchema.pre('save', function(next){ // 箭头函数this指向有问题，空对象
	let user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.updateAt = Date.now();
	}
	// 对hash后的密码加盐，并且重新复制给passwork
	bcrypt.genSalt(SALT_WORK_FACTOR, (err,salt)=>{
		if(err) return next(err);

		bcrypt.hash(user.password, salt, (err,hash)=>{
			if(err) return next(err);

			user.password=hash;
			next();// 存储流程走下去
		});
	});
});
// 实例方法
UserSchema.methods={
  comparePassword: function(_password, password) {
    return function(cb) {
      bcrypt.compare(_password, password, function(err, isMatch) {
        cb(err, isMatch);
      });
    };
  }
};
// 静态方法
UserSchema.statics = {
	fetch(cb){ // 取出数据库所有数据
		return this
			.find({})
			.sort('meta.updateAt')  // 排序
			.exec(cb)
	},
	findById(id, cb){ // 查询单条数据
		return this
			.findOne({_id: id})
			.exec(cb)
	}
};

module.exports = UserSchema;