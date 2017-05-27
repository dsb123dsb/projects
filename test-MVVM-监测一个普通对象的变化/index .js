const  OP = Object.prototype; // 缓存对象原型

/*
	*需要重写的数组方法OAM是overrideArrayMethod的缩写
*/
const OAM = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

class Jsonnb{
	constructor(obj, callback){
		if(OP.toString.call(obj) !=='[object Object]'){
			console.log('This parameter must be an object: '+ obj);
		}
		this.$callback=callback;
		this.observe(obj);
	}

	observe(obj, path){
		console.log('obj:', obj, 'this', this);
		// 如果发现 监听对象是数组的话 调用 overrideArrayProto 方法
		if(OP.toString.call(obj) === '[object Array]'){
			this.overrideArrayProto(obj, path);
		};
		Object.keys(obj).forEach(function(key, index, keyArray){
			// console.log('this:', this); // 非严格模式指向window，严格模式undeefined
			var oldVal = obj[key];

			var pathArray = path&&path.slice(0);
			if(path){
				pathArray.push(key);
			}else{
				pathArray = [key];
			}

			Object.defineProperty(obj, key, {
				get: function(){
					return oldVal;
				},
				set: (function(newVal){ // newVal 未设置的新值
					if(newVal !== oldVal){
						if(OP.toString.call(obj[key]) === '[object Object]' || OP.toString.call(obj) === '[object Array]'){
							this.observe(newVal, pathArray); // 监听新设置的值							
						}
					}
					// console.log('defineProperty this:', this);
					this.$callback(newVal, oldVal, pathArray);
					oldVal=newVal; // 更新旧值
				}).bind(this) // 不绑定this时 this指向obj
			});
			if(OP.toString.call(obj[key]) === '[object Object]' || OP.toString.call(obj[key]) === '[object Array]'){
				this.observe(obj[key], pathArray);
			}
		}, this);// 传入this或者使用箭头函数
	}
	overrideArrayProto(array, path){
		var originalProto = Array.prototype,// 保存原始原型
			overrideProto = Object.create(Array.prototype),
			self = this,
			result;

			//遍历需要重写的方法
		Object.keys(OAM).forEach((key, index, array) => {
			var method = OAM[index],
				oldArray = [];
			// 使用 Object.defineProperty 给 overrideProto 添加属性，属性的名称是对应的数组函数名，值是函数
			Object.defineProperty(overrideProto, method, {
				value: function(){
					oldArray = this.slice(0); // defineProperty 不绑定this时 this指向overrideProto
					// var arg = [].slice.apply(arguments);
					console.log('arguments: ', arguments);
					var arg = [...arguments]; // arguments未method参数
					// 调用原始原型的数组方法
					result = originalProto[method].apply(this, arg);
					// 对新的数组监听
					self.observe(this, path);
					// 执行回调
					self.$callback(this, oldArray, path);

					return result;
				},
                writable: true,
                enumerable: false,
                configurable: true
			});
		});

		// 最后 让该数组实例的 __proto__ 属性指向 假的原型 overrideProto
        array.__proto__ = overrideProto;

	}
}