const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const MovieSchema = new Schema({
	director: String,
	title: String,
	doubanId: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	genres: [String],
	year: Number,
	pv: {
		type: Number,
		default:0
	},
	category: {
		type: ObjectId,
		ref: 'Category'
	}, // Object类型
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
MovieSchema.pre('save', (next) => {
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.updateAt = Date.now();
	}
	next();// 存储流程走下去
});
// 静态方法
MovieSchema.statics = {
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

module.exports = MovieSchema;