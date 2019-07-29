import Options from './model/options';
import Observer from './observer/observer';
import Compile from './compile';

export default class ZVue {
  $el: any;
  $data: any;

  constructor(options: Options) {
    this.$el = options.el;
    this.$data = options.data;

    if (this.$el) {
      new Observer(this.$data);
      this.proxyData(this.$data);
      new Compile(this.$el, this);
    }
  }

  proxyData(data: any) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newVal) {
          data[key] = newVal;
        }
      });
    });
  }
}

declare global {
  interface Window {
    ZVue: any;
  }
}

window.ZVue = ZVue;
