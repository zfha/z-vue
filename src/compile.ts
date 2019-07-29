import ContextUtil from './context-util';
import ZVue from './index';

export default class Compile {
  private el?: Node;
  private vm?: ZVue;

  constructor(el: string | Node, vm: ZVue) {
    this.vm = vm;
    if (el instanceof Node) {
      this.el = this.isElementNode(el) ? el : undefined;
    } else {
      this.el = document.querySelector(el);
    }
    if (this.el) {
      // 1、把这些原来真实的 Dom 移动到内存中，即 fragment（文档碎片）
      let fragment = this.node2fragment();
      this.compile(fragment);
      this.el.appendChild(fragment);
    }
  }

  compile(fragment: DocumentFragment) {
    let childNodes = fragment.childNodes;
    Array.from(childNodes).map((node: Node) => {
      if (this.isElementNode(node)) {
        this.compile(<DocumentFragment>node);
        this.compileElement(node);
      } else {
        this.compileText(node);
      }
    });
  }

  compileElement(node: Node) {
    // 取出当前节点的属性，类数组
    let attrs = (<Element>node).attributes;
    Array.from(attrs).map(attr => {
      let attrbuteName = attr.name;
      if (this.isDirective(attrbuteName)) {
        let exp = attr.value;
        let [, type] = attrbuteName.split('-');
        ContextUtil.model(node, this.vm, exp);
      }
    });
  }

  compileText(node: Node) {
    // 获取文本节点的内容
    let exp = node.textContent;

    // 创建匹配 {{}} 的正则表达式
    let reg = /\{\{(.+)\}\}/g;

    // 如果存在 {{}} 则使用 text 指令的方法
    if (reg.test(exp)) {
      ContextUtil.text(node, this.vm, exp);
    }
  }

  isDirective(name: string) {
    return name.includes('z-');
  }

  node2fragment(): DocumentFragment {
    let fragment = document.createDocumentFragment();
    let firstChild: ChildNode | null;
    // 循环取出根节点中的节点并放入文档碎片中
    while ((firstChild = this.el.firstChild)) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }

  // 判断是否是元素节点
  isElementNode(node: Node) {
    return node.nodeType === 1;
  }
}
