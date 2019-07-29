import ZVue from '../index';
import ContextUtil from '../context-util';
import Dep from './dep';

export default class Watcher {
  private vm: ZVue;
  private exp: string;
  private cb: Function;
  private value: any;

  constructor(vm: ZVue, exp: string, cb: Function) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;

    // 初始化value值
    this.value = this.get();
  }

  get() {
    Dep.watcher = this;
    const value = ContextUtil.getVal(this.vm, this.exp);
    Dep.watcher = null;

    return value;
  }

  update() {
    const newVal = ContextUtil.getVal(this.vm, this.exp);
    let oldVal = this.value;
    if (newVal !== oldVal) {
      this.cb(newVal);
    }
  }
}
