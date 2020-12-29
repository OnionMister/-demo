// 观察者watcher,作用更新视图
class Watcher {
    constructor(vm, expr, callback) {
        this.vm = vm; // 实例
        this.expr = expr; // 被观察的数据
        this.callback = callback; // 回调函数更新视图
        this.oldVal = this.getOldVal() // 旧值
    }
    // 获取旧值，使用指令解析中的compileUtil中的getVal方法
    getOldVal() {
        // 观察者被创建时会收集旧值，此时将该变量的watcher实例挂到Dep上。
        Dep.target = this; // this指向Watcher的实例
        const oldVal = compileUtil.getVal(this.expr, this.vm);
        delete Dep.target; // 旧值获取完毕清除Dep上的watcher
        return oldVal;
    }
    // 更新视图 -- 新值和就值是否有变化，有执行回调更新视图
    update() {
        // 数据变化后，Dep通知watcher 更新视图，所以此处获取到的是新值。
        const newVal = compileUtil.getVal(this.expr, this.vm);
        if (newVal !== this.oldVal) {
            // 新值和就值不同时，更新视图。
            this.callback(newVal);
        }
    }
}