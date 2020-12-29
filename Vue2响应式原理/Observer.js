// 通知watcher数据变化需更新视图 和 收集每个数据对应watcher的作用
class Dep {
    constructor() {
        this.subs = []
    }
    // 收集观察者
    addSub(watcher) {
        this.subs.push(watcher);
    }
    // 通知观察者更新视图
    notify() {
        console.log(this)
        this.subs.forEach(w => w.update());
    }
}
// 劫持监听数据
class Observer {
    constructor(data) {
        this.observer(data);
    }
    // 观察对象数据
    observer(data) {
        if (data && typeof data === 'object') {
            Object.keys(data).forEach((key) => {
                // 劫持监听数据
                this.defineReactive(data, key, data[key]);
            })
        }
    }
    // 劫持监听数据
    defineReactive(data, key, value) {
        // 递归遍历 每一层
        this.observer(value);
        // 实例化Dep存储watcher和通知watcher更新视图。
        const dep = new Dep();
        // 劫持每个属性,Object.defineProperty(目标对象，劫持的键值，键值对应的属性的特性)
        Object.defineProperty(data, key, {
            enumerable: true, // 可以被枚举（使用for...in或Object.keys()）
            configurable: false, // 是否可再次被设置属性特性
            get() { // 获取属性值
                // 得到数据的同时向Dep中添加观察者订阅器（每个数据都有自己的watcher）
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set: (newValue) => { // 修改属性，使用箭头函数获取定义上下文的this，普通函数this指向了传进来的data
                // 防止新修改的属性不被劫持监听
                this.observer(newValue);
                if (newValue !== value) {
                    value = newValue;
                    // 数据修改通知对应watcher
                    dep.notify();
                }
            }
        })
    }
}