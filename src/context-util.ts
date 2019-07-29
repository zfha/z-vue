import ZVue from './index';
import Watcher from './observer/watcher';

class Updater {
  static textUpdater(node: Node, value: string) {
    node.textContent = value;
  }
  static modelUpdater(node: Node, value: string) {
    if (
      node instanceof HTMLInputElement ||
      node instanceof HTMLTextAreaElement
    ) {
      node.value = value;
    }
  }
}

export default class ZContext {
  constructor() {}

  static getVal(vm: ZVue, exp: string): any {
    // 将匹配的值用 . 分割开，如 vm.data.a.b
    const sections = exp.trim().split('.');

    // 归并取值
    return sections.reduce((prev: any, next: string) => {
      return prev[next];
    }, vm.$data);
  }

  static getTextVal(vm: ZVue, exp: string): any {
    return exp.replace(/\{\{(.+)\}\}/g, (a, b) => {
      return this.getVal(vm, b);
    });
  }

  // 递归赋值
  static setVal(vm: ZVue, exp: string, val: any) {
    const sections = exp.trim().split('.');
    return sections.reduce((prev: any, next: string, currentIndex: number) => {
      // 依次获取属性里面的值
      if (currentIndex === sections.length - 1) {
        return (prev[next] = val);
      }
      // 继续归并
      return prev[next];
    }, vm.$data);
  }

  static model(node: Node, vm: ZVue, exp: string) {
    const updateFn = Updater.modelUpdater;
    const value = this.getVal(vm, exp);

    // 加入监听器
    new Watcher(vm, exp, (newValue: string) => {
      updateFn && updateFn(node, newValue);
    });

    node.addEventListener('input', e => {
      const newVal = (<HTMLInputElement>e.target).value;
      this.setVal(vm, exp, newVal);
    });

    // 第一次设置值
    updateFn && updateFn(node, value);
  }

  static text(node: Node, vm: ZVue, exp: string) {
    const updateFn = Updater.textUpdater;

    // 获取 data 中对应的变量的值
    const value = this.getTextVal(vm, exp);

    // 通过正则替换，将取到数据中的值替换掉 {{ }}
    const b = exp.replace(/\{\{([^}]+)\}\}/g, (a, b) => {
      return b;
    });

    new Watcher(vm, b, (newValue: string) => {
      updateFn && updateFn(node, newValue);
    });

    // 第一次设置值
    updateFn && updateFn(node, value);
  }
}
