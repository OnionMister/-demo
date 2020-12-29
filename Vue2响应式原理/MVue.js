// Vue入口
class MVue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;
        if (this.$el) {
            // 1.实例化数据劫持监听--Object.defineProperty
            new Observer(this.$data);
            // 2.实例化指令解析器
            new Compile(this.$el, this);
            // 对data进行代理实现 this.person.name。methods、computed的代理实现雷同。
            this.proxyData(this.$data);
        }
    }
    // 对data中定义的数据进行代理，相当于挂载到了vm实力上，可以直接【this.数据】来使用，而不用【this.data.数据】
    proxyData(data) {
        for (const key in data) {
            // 对data第一层做劫持绑定get和set。this指向vm
            Object.defineProperty(this, key, {
                get() {
                    return data[key];
                },
                set(newVal) {
                    data[key] = newVal;
                }
            })
        }
    }
}