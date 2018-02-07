const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId; // 不是很懂,主键 ObjectId

const CategorySchema = new Schema({
	name: String,
	movies: [{type: ObjectId, ref: 'Movie'}],
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
CategorySchema.pre('save', (next) => {
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.updateAt = Date.now();
	}
	next();// 存储流程走下去
});
// 静态方法
CategorySchema.statics = {
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

module.exports = CategorySchema;