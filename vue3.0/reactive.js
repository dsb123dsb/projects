function reactive(target){
    // 创建响应式对象
    return createReactiveObject(target);
}
function isObject(target){
    return typeof target === 'object' && target!== null;
}
function hasOwn(target,key){
  return target.hasOwnProperty(key);
}
function createReactiveObject(target){
    // 判断target是不是对象,不是对象不必继续
    if(!isObject(target)){
        return target;
    }
    const handlers = {
        get(target,key,receiver){ // 取值
            console.log('获取', key, receiver);
            track(target,'get',key); // 依赖收集
            let res = Reflect.get(target,key,receiver);
            return res;
        },
        set(target,key,value,receiver){ // 更改 、 新增属性
            // 更改、新增属性
            let oldValue = target[key]; // 获取上次的值
            let hadKey = hasOwn(target,key); // 看这个属性是否存在
            let result = Reflect.set(target, key, value, receiver);
            if(!hadKey){ // 新增属性
                console.log('更新 添加', key)
                trigger(target,'add',key); // 触发添加
            }else if(oldValue !== value){ // 修改存在的属性
                console.log('更新 修改', key)
                trigger(target,'set',key); // 触发修改
            }
            // 当调用push 方法第一次修改时数组长度已经发生变化
            // 如果这次的值和上次的值一样则不触发更新
            return result;
        },
        deleteProperty(target,key){ // 删除属性
            console.log('删除')
            const result = Reflect.deleteProperty(target,key);
            return result;
        }
    }
    // 开始代理
    observed = new Proxy(target,handlers);
    return observed;
}

function effect(fn) {
    const effect = createReactiveEffect(fn); // 创建响应式的effect
    effect(); // 先执行一次
    return effect;
}
const activeReactiveEffectStack = []; // 存放响应式effect
function createReactiveEffect(fn) {
    const effect = function() {
        // 响应式的effect
        return run(effect, fn);
    };
    return effect;
}
function run(effect, fn) {
    try {
        activeReactiveEffectStack.push(effect);
    return fn(); // 先让fn执行,执行时会触发get方法，可以将effect存入对应的key属性
    } finally {
        activeReactiveEffectStack.pop(effect);
    }
}

const targetMap = new WeakMap();
function track(target,type,key){
    // 查看是否有effect
    const effect = activeReactiveEffectStack[activeReactiveEffectStack.length-1];
    if(effect){
        let depsMap = targetMap.get(target);
        if(!depsMap){ // 不存在map
            targetMap.set(target,depsMap = new Map());
        }
        let dep = depsMap.get(target);
        if(!dep){ // 不存在set
            depsMap.set(key,(dep = new Set()));
        }
        if(!dep.has(effect)){
            dep.add(effect); // 将effect添加到依赖中
        }
    }
}

function trigger(target,type,key){
    const depsMap = targetMap.get(target);
    if(!depsMap){
        return
    }
    let effects = depsMap.get(key);
    if(effects){
        effects.forEach(effect=>{
            effect();
        })
    }
    // 处理如果当前类型是增加属性，如果用到数组的length的effect应该也会被执行
    if (type === "add" && Array.isArray(target)) {
        let effects = depsMap.get("length");
        if (effects) {
        effects.forEach(effect => {
            effect();
        });
        }
    }
}

var p2 = reactive([1,2,3,4]);
effect(()=>{
    console.log('reactive', p2.length);
})
p2.push(5);
