/******* 设计模式原则 
	1. 单一职责SRP，一个对象只做一件事情，代理模式，迭代器模式，单例模式，装饰者模式   
	2. 最少知识原则 LKP ，对象之间尽可能少发生联系，中介者模式，外观模式  
	3. 开放封闭原则 OCP，最重要的原则，软件实体是可以拓展的，但是不可修改的，， 发布订阅模式，模板方法模式，策略模式，职责链模式，代理模式，

*******/
//code reconstruct
//1.提炼函数
	// version1.0
	var getUserInfo = function(){
		ajax( 'http:// xxx.com/userInfo', function( data ){
			console.log( 'userId: ' + data.userId );
			console.log( 'userName: ' + data.userName );
			console.log( 'nickName: ' + data.nickName );
		});
	};

	//version2.0
	var getUserInfo = function(){
		ajax( 'http:// xxx.com/userInfo', function( data ){
			printDetails( data );
		});
	};
	var printDetails = function( data ){
		console.log( 'userId: ' + data.userId );
		console.log( 'userName: ' + data.userName );
		console.log( 'nickName: ' + data.nickName );
	};

// 2.合并重复的条件片段
	// version1.0
	var paging = function( currPage ){
	if ( currPage <= 0 ){
		currPage = 0;
		jump( currPage ); // 跳转
		}else if ( currPage >= totalPage ){
		currPage = totalPage;
		jump( currPage ); // 跳转
		}else{
		jump( currPage ); // 跳转
		}
	};

	// version2.0
	var paging = function( currPage ){
		if ( currPage <= 0 ){
		currPage = 0;
		}else if ( currPage >= totalPage ){
		currPage = totalPage;
		}
		jump( currPage ); // 把jump 函数独立出来
	};

//3.把条件分支语句提炼成函数
	// version1.0
	var getPrice = function(price){
		var date = new Date();
		if(date.getMonth()>=6 &&date.getMonth()<=9){// 夏天
			return price*0.8
		}
		return price;
	};

	// version2.0
	var isSummer = function(){
		var date = new Date();
		return date.getMonth()>=6 &&date.getMonth()<=9;
	};

	var getPrice = function(price){
		if(isSummer()){// 夏天
			return price*0.8
		}
		return price;
	};	

// 4. 合理使用循环
	// version1.0
	var createXHR = function(){
		var xhr;
		try{
			xhr = new ActiveXObject( 'MSXML2.XMLHttp.6.0' );
		}catch(e){
			try{
				xhr = new ActiveXObject( 'MSXML2.XMLHttp.3.0' );
			}catch(e){
				xhr = new ActiveXObject( 'MSXML2.XMLHttp' );
			}
		}
		return xhr;
	};
	var xhr = createXHR();

	// version2.0
	var createXHR = function(){
		var versions= [ 'MSXML2.XMLHttp.6.0ddd', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp' ];
		for ( var i = 0, version; version = versions[ i++ ]; ){
			try{
				return new ActiveXObject( version );
			}catch(e){
			}
		}
	};
	var xhr = createXHR();

// 5.提前让函数退出代替嵌套条件分支
	// version1.0
	var del = function(obj){
		var ret;
		if(!obj.isReadOnly){ // 不为只读才被删除
			if(obj.isFolder){// 如果是文件夹
				ret = delFolder(obj);
			}else if(obj.isFile){// 如果是文件
				ret = delFile(obj); 
			}
		}
		return ret;
	};

	// version 2.0
	var del = function( obj ){
		if ( obj.isReadOnly ){ // 反转if 表达式
			return;
		}
		if ( obj.isFolder ){
			return deleteFolder( obj );
		}
		if ( obj.isFile ){
			return deleteFile( obj );
		}
	};

// 6.传递对象参数代替过长的参数列表
	// version1,0
	var setUserInfo = function( id, name, address, sex, mobile, qq ){
		console.log( 'id= ' + id );
		console.log( 'name= ' +name );
		console.log( 'address= ' + address );
		console.log( 'sex= ' + sex );
		console.log( 'mobile= ' + mobile );
		console.log( 'qq= ' + qq );
	};
	setUserInfo( 1314, 'sven', 'shenzhen', 'male', '137********', 377876679 );

	// version2.0
	var setUserInfo = function( obj ){
		console.log( 'id= ' + obj.id );
		console.log( 'name= ' + obj.name );
		console.log( 'address= ' + obj.address );
		console.log( 'sex= ' + obj.sex );
		console.log( 'mobile= ' + obj.mobile );
		console.log( 'qq= ' + obj.qq );
	};
	setUserInfo({
		id: 1314,
		name: 'sven',
		address: 'shenzhen',
		sex: 'male',
		mobile: '137********',
		qq: 377876679
	});

// 7.尽量减少参数数量

	// version1.0
	var draw = function( width, height, square ){};
	// version2.0
	var draw = function( width, height ){
		var square = width * height;
	}; 

// 8 合理使用链式调用
 	//在JavaScript 中，可以很容易地实现方法的链式调用，即让方法调用结束后返回对象自身，
 	var User = {
		id: null,
		name: null,
		setId: function( id ){
			this.id = id;
			return this;
		},
		setName: function( name ){
			this.name = name;
			return this;
		}
	};
	console.log( User.setId( 1314 ).setName( 'sven' ) );
	//如果该链条的结构相对稳定，后期不易发生修改，那么使用链式调用无可厚非。
	//但如果该链条很容易发生变化，导致调试和维护困难，那么还是建议使用普通调用的形式：

// 9.分解大型类分解大型类
	// version1.0  
	// 负责创建游戏人物的Spirit 类非常庞大
	//不仅要负责创建人物精灵，还包括了人物的攻击、防御等动作方法
	var Spirit = function( name ){
		this.name = name;
	};
	Spirit.prototype.attack = function( type ){ // 攻击
		if ( type === 'waveBoxing' ){
			console.log( this.name + ': 使用波动拳' );
		}else if( type === 'whirlKick' ){
			console.log( this.name + ': 使用旋风腿' );
		}
	};
	var spirit = new Spirit( 'RYU' );
	spirit.attack( 'waveBoxing' ); // 输出：RYU: 使用波动拳
	spirit.attack( 'whirlKick' ); // 输出：RYU: 使用旋风腿

	// version 2.0
	// Spirit.prototype.attack 这个方法实现是太庞大了，实际上它完全有必要作为一个单独的类存在。
	//面向对象设计鼓励将行为分布在合理数量的更小对象之中：
	var Attack = function( spirit ){
		this.spirit = spirit;
	};
	Attack.prototype.start = function( type ){
		return this.list[ type ].call( this );
	};
	Attack.prototype.list = {
		waveBoxing: function(){
		console.log( this.spirit.name + ': 使用波动拳' );
		},
		whirlKick: function(){
		console.log( this.spirit.name + ': 使用旋风腿' );
		}
	};
	//是把攻击动作委托给Attack 类的对象来执行，这段代码也是策略模式的运用之一
	var Spirit = function( name ){
		this.name = name;
		this.attackObj = new Attack( this );
	};
	Spirit.prototype.attack = function( type ){ // 攻击
		this.attackObj.start( type );
	};
	var spirit = new Spirit( 'RYU' );
	spirit.attack( 'waveBoxing' ); // 输出：RYU: 使用波动拳
	spirit.attack( 'whirlKick' ); // 输出：RYU: 使用旋风腿

// 10.用return 退出多重循环
	// version1.0 引入一个控制标记变量
	var func = function(){
		var flag = false;
		for ( var i = 0; i < 10; i++ ){
			for ( var j = 0; j < 10; j++ ){
				if ( i * j >30 ){
				flag = true;
				break;
				}
				}
			if ( flag === true ){
			break;
			}
		}
	};

	// version2.0 设置循环标记
	var func = function(){
		outerloop:
		for ( var i = 0; i < 10; i++ ){
			innerloop:
			for ( var j = 0; j < 10; j++ ){
				if ( i * j >30 ){
					break outerloop;
				}
			}
		}
	};

	// verison3.0 在需要中止循环的时候直接退出整个方法
	var func = function(){
		for ( var i = 0; i < 10; i++ ){
			for ( var j = 0; j < 10; j++ ){
				if ( i * j >30 ){
					return;
				}
			}
		}
	};

	// version 4.0 循环后面的代码放到return 后面，
	//如果代码比较多，把它们提炼成一个单独的函数：
	var print = function( i ){
		console.log( i );
		};
		var func = function(){
		for ( var i = 0; i < 10; i++ ){
			for ( var j = 0; j < 10; j++ ){
				if ( i * j >30 ){
					return print( i );
				}
			}
		}
	};
	func();