import Watcher from './watcher';

export default class Dep {
  static watcher: Watcher;
  private subs: Watcher[];

  constructor() {
    this.subs = [];
  }
  addSub(watcher: Watcher) {
    this.subs.push(watcher);
  }
  // 通知
  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}
