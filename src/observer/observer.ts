import Dep from './dep';

export default class Obsever {
  constructor(data: any) {
    this.observe(data);
  }

  observe(data: any) {
    if (!data || typeof data !== 'object') {
      return;
    }

    Object.keys(data).map(key => {
      let value = data[key];
      this.defineReactive(data, key, value);
      this.observe(value);
    });
  }

  defineReactive(data: any, key: string, value: any) {
    let that = this;
    let dep = new Dep();
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        Dep.watcher && dep.addSub(Dep.watcher);
        return value;
      },
      set(newValue) {
        if (newValue !== value) {
          that.observe(newValue);
          value = newValue;
          dep.notify();
        }
      }
    });
  }
}
