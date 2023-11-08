/*
 * @Date: 2023-07-12 17:42:06
 * @LastEditors: asahi
 * @LastEditTime: 2023-08-28 16:35:08
 * @FilePath: \litegraph\src\shared\UI\Base\DomBase.ts
 */

import { IDom } from "../../../interfaces";
import { isNumber } from "../../../Utils";

export abstract class DomBase implements IDom {
  // id 或 class 前缀
  static prefix: string = 'ra-graph-';

  /**
   * DOM元素
   * @val DOM
   */
  public DOM: HTMLElement;

  constructor(tag: string = 'div') {
    this.DOM = document.createElement(tag);
  }

  /**
   * 设置元素ID
   * @param id
   */
  setId(id: string): this {
    this.DOM.id = `${DomBase.prefix}${id}`;
    return this;
  }

  /**
   * @description 获取宽度
   */
  getClientWidth(): number {
    return this.DOM.clientWidth;
  }

  /**
   * @description 获取高度
   */
  getClientHeight(): number {
    return this.DOM.clientHeight;
  }

  /**
   * @description 获取相对高度
   */
  getOffsetHeight(): number {
    return this.DOM.offsetHeight;
  }

  /**
   * @description 获取相对宽度
   */
  getOffsetWidth(): number {
    return this.DOM.offsetWidth;
  }

  getOffsetLeft(): number {
    return this.DOM.offsetLeft;
  }

  getOffsetTop(): number {
    return this.DOM.offsetTop;
  }

  /**
   * 设置元素 CSS
   * @param style 样式
   */
  setStyle(style: Partial<CSSStyleDeclaration>): this {
    for (let item in style) {
      this.DOM.style[item] = style[item] as string;
    }
    return this;
  }

  /**
   * 设置元素的定位方式
   * @param {string} position
   * @param top
   * @param left
   * @param zIndex
   * @param unit
   * @returns
   */
  setPosition(
    position: string = 'absolute',
    top: string | number = 0,
    left: string | number = 0,
    zIndex: string | number = 0,
    unit = 'px'
  ): this {
    return this.setStyle({
      position: position,
      top: isNumber(top) ? `${top}${unit}` : top,
      left: isNumber(left) ? `${left}${unit}` : left,
      zIndex: isNumber(zIndex) ? `${zIndex}` : zIndex,
    });
  }

  /**
   * 设置元素的定位方式为 absolute
   * @param top
   * @param left
   * @param zIndex
   * @param unit
   * @returns
   */
  setAbsolute(top: string | number = 0, left: string | number = 0, zIndex: string | number = 0, unit = 'px'): this {
    return this.setPosition('absolute', top, left, zIndex, unit);
  }

  /**
   * @description: 设置元素相对左侧定位位置
   * @param {string} value 值
   * @param {string} unit 单位
   * @return {*}
   */
  setLeft(value: string | number, unit: string = 'px'): this {
    return this.setStyle({
      left: isNumber(value) ? `${value}${unit}` : value,
    });
  }

  /**
   * @description: 设置元素相对右侧定位位置
   * @param {string} value 值
   * @param {string} unit 单位
   * @return {*}
   */
  setRight(value: string | number, unit: string = 'px'): this {
    return this.setStyle({
      right: isNumber(value) ? `${value}${unit}` : value,
    });
  }

  /**
   * @description: 设置元素相对上方定位位置
   * @param {string} value 值
   * @param {string} unit 单位
   * @return {*}
   */
  setTop(value: string | number, unit: string = 'px'): this {
    return this.setStyle({
      top: isNumber(value) ? `${value}${unit}` : value,
    });
  }

  /**
   * 添加元素class
   */
  addClass(name: string): this {
    this.DOM.classList.add(`${DomBase.prefix}${name}`);
    return this;
  }

  /**
   * 移除元素class
   */
  removeClass(name: string): this {
    this.DOM.classList.remove(`${DomBase.prefix}${name}`);
    return this;
  }

  /**
   * 替换元素class
   */
  replaceClass(oldName: string, newName: string): this {
    this.DOM.classList.replace(`${DomBase.prefix}${oldName}`, `${DomBase.prefix}${newName}`);
    return this;
  }

  /**
   * 显示元素
   */
  show(): this {
    return this.setStyle({ display: 'block' });
  }

  /**
   * 元素是否已显示
   */
  isShow(): boolean {
    return this.DOM.style.display === 'block';
  }

  /**
   * 隐藏元素
   */
  hide(): this {
    return this.setStyle({ display: 'none' });
  }

  /**
   * 元素是否已隐藏
   */
  isHidden(): boolean {
    return this.DOM.style.display === 'none';
  }

  /**
   * 显示/隐藏切换
   */
  toggle(): this {
    if (this.DOM.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
    return this;
  }

  /**
   * 设置元素宽度
   * @param {string | number} value 宽度
   * @param {'' | 'min' | 'max'} type 类型
   * @param {string} unit 宽度单位，默认 px
   * @returns
   */
  setWidth(value: string | number, type: '' | 'min' | 'max' = '', unit: string = 'px'): this {
    return this.setStyle({
      [`${type}${type ? 'W' : 'w'}idth`]: isNumber(value) ? `${value}${unit}` : value,
    });
  }

  /**
   * 设置元素高度
   * @param {string | number} value 高度
   * @param {'' | 'min' | 'max'} type 类型
   * @param {string} unit 宽度单位，默认 px
   * @returns
   */
  setHeight(value: string | number, type: '' | 'min' | 'max' = '', unit: string = 'px'): this {
    return this.setStyle({
      [`${type}${type ? 'H' : 'h'}eight`]: isNumber(value) ? `${value}${unit}` : value,
    });
  }

  /**
   * 设置元素背景颜色
   * @param {string} color 颜色
   * @returns
   */
  setBackgroundColor(color: string): this {
    return this.setStyle({
      backgroundColor: color,
    });
  }

  /**
   * 设置元素背景颜色/图
   * @param background
   * @param type
   */
  setBackground(background: string,type:  'Color' | 'Image' = 'Color'): this {
    return this.setStyle({
      [`background${type}`]: type==='Color'?background:`url(${background})`,
      'backgroundSize':'100% 100%'
    });
  }

  /**
   * 设置元素属性
   * @param {string} qualifiedName 限定名
   * @param {string} value 值
   */
  setAttribute(qualifiedName: string, value: string): this {
    this.DOM.setAttribute(qualifiedName, value);
    return this;
  }

  removeAttribute(qualifiedName: string){
    this.DOM.removeAttribute(qualifiedName)
  }

  /**
   * 获取元素属性
   * @param {string} qualifiedName 限定名
   */
  getAttribute(qualifiedName: string): string | null {
    return this.DOM.getAttribute(qualifiedName);
  }

  /**
   * 设置元素为可编辑
   * @param {boolean} value 值
   */
  setContentEditable(value: boolean = false): this {
    this.DOM.setAttribute('contentEditable', value.toString());
    return this;
  }

  /**
   * 元素内边距
   * @param value
   * @returns
   */
  setPadding(value: string): this {
    return this.setStyle({ padding: value });
  }

  /**
   * 元素内上边距
   * @param value 值
   * @returns
   */
  setPaddingTop(value: string): this {
    return this.setStyle({ paddingTop: value });
  }

  /**
   * 元素内下边距
   * @param value 值
   * @returns
   */
  setPaddingBottom(value: string): this {
    return this.setStyle({ paddingBottom: value });
  }

  /**
   * 元素内左边距
   * @param value 值
   * @returns
   */
  setPaddingLeft(value: string): this {
    return this.setStyle({ paddingLeft: value });
  }

  /**
   * 元素内右边距
   * @param value 值
   * @returns
   */
  setPaddingRight(value: string): this {
    return this.setStyle({ paddingRight: value });
  }

  /**
   * 元素外边距
   * @param value 值
   * @returns
   */
  setMargin(value: string): this {
    return this.setStyle({ margin: value });
  }

  /**
   * 元素上边距
   * @param value 值
   * @returns
   */
  setMarginTop(value: string): this {
    return this.setStyle({ marginTop: value });
  }

  /**
   * 元素左边距
   * @param value 值
   * @returns
   */
  setMarginLeft(value: string): this {
    return this.setStyle({ marginLeft: value });
  }

  /**
   * 元素右边距
   * @param value 值
   * @returns
   */
  setMarginRight(value: string): this {
    return this.setStyle({ marginRight: value });
  }

  /**
   * 元素下边距
   * @param value 值
   * @returns
   */
  setMarginBottom(value: string): this {
    return this.setStyle({ marginBottom: value });
  }

  /**
   * @description:元素字体大小
   * @param {number} value 数值
   * @param {string} unit 单位
   * @returns
   */
  setFontSize(value: number, unit: string = 'px'): this {
    return this.setStyle({
      fontSize: `${value}${unit}`,
    });
  }

  /**
   * @description:新增一个子组件
   * @param {HTMLElement} child 子组件
   */
  add(child: HTMLElement | { DOM: HTMLElement;[key: string]: any } | string | SVGElement) {
    if (typeof child === 'string') {
      this.DOM.appendChild(document.createTextNode(child));
    } else {
      // @ts-ignore
      this.DOM.appendChild(child.DOM ?? child);
    }
    return this;
  }

  /**
   * 设置阴影
   * @param {string} value 值
   * @returns
   */
  setBoxShadow(value: string = '#ccc 0px 0px 10px 1px') {
    return this.setStyle({
      boxShadow: value,
    });
  }

  /**
   * 设置圆角
   * @param {string} value 值
   * @returns
   */
  setBorderRadius(value: string = '5px') {
    return this.setStyle({
      borderRadius: value,
    });
  }

  /**
   * @description: 设置颜色
   * @param {string} color
   * @return {*}
   */
  setColor(color: string): this {
    return this.setStyle({ color });
  }

  /**
   * @description: flex布局
   * @param {*} value
   * @return {*}
   */
  setFlex(value: string = 'flex'): this {
    return this.setStyle({ display: value });
  }

  /**
   * @description: flex拆行
   * @param {*} value
   * @return {*}
   */
  setFlexWrap(value: 'nowrap' | 'wrap' | 'wrap-reverse' | 'initial' | 'inherit' = 'nowrap'): this {
    return this.setStyle({ flexWrap: value });
  }

  /**
   * @description: flex JustifyContent
   * @param {*} value
   * @return {*}
   */
  setJustifyContent(
    value:
      | 'flex-start'
      | 'flex-end'
      | 'center'
      | 'space-between'
      | 'space-evenly'
      | 'space-around'
      | 'initial'
      | 'inherit' = 'flex-start'
  ): this {
    return this.setStyle({ justifyContent: value });
  }

  /**
   * @description: flex AlignItems
   * @param {*} value
   * @return {*}
   */
  setAlignItems(
    value: 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'initial' | 'inherit' = 'center'
  ): this {
    return this.setStyle({ alignItems: value });
  }

  /**
   * @description: flex FlexDirection
   * @param {*} value
   * @return {*}
   */
  setFlexDirection(value: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'initial' | 'inherit'): this {
    return this.setStyle({ flexDirection: value });
  }

  /**
   * @description: overflow
   * @param {*} value
   * @return {*}
   */
  setOverflow(value: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit' = 'visible'): this {
    return this.setStyle({ overflow: value });
  }

  /**
   * @description: 是否能选取元素的文本
   * @param {*} value
   * @return {*}
   */
  setUserSelect(value: 'auto' | 'none' | 'text' | 'all' = 'auto'): this {
    return this.setStyle({
      webkitUserSelect: value,
      userSelect: value,
    });
  }

  /**
   * @description: 光标形状
   * @param {*} value
   * @return {*}
   */
  setCursor(
    value:
      | 'auto'
      | 'default'
      | 'crosshair'
      | 'pointer'
      | 'move'
      | 'text'
      | 'wait'
      | 'help'
      | 'n-resize'
      | 'w-resize' = 'auto'
  ): this {
    return this.setStyle({ cursor: value });
  }

  /**
   * @description: 设置元素是否对鼠标事件做出反应
   * @param {*} value
   * @return {*}
   */
  setPointerEvents(value: 'auto' | 'none' | 'initial' | 'inherit' = 'auto'): this {
    return this.setStyle({ pointerEvents: value });
  }

  /**
   * 定义如何计算一个元素的总宽度和总高度
   * @param {string} value
   * @returns
   */
  setboxSizing(value: 'content-box' | 'border-box' | 'inherit' = 'content-box'): this {
    return this.setStyle({ boxSizing: value });
  }

  /**
   * @description: innerText
   * @param {string} value 值
   * @return {*}
   */
  innerText(value: string): this {
    this.DOM.innerText = value;
    return this;
  }

  /**
   * @description: 获取innerText
   * @param {string} value 值
   * @return {*}
   */
  getInnerText(): string {
    return this.DOM.innerText;
  }

  /**
   * 销毁
   */
  remove() {
    this.DOM.remove();
  }

  /**
   * 清空子节点
   */
  clear() {
    this.DOM.innerHTML = '';
  }

  /**
   * 单击事件
   * @param closure 闭包
   */
  onClick(closure: (e: MouseEvent) => any, single = false) {
    if (single) {
      this.DOM.onclick = closure;
    } else {
      this.DOM.addEventListener('click', (e) => {
        closure(e);
      });
    }
  }

  /**
   * @description: 滚轮事件
   * @param {function} closure 处理闭包
   * @param {boolean} single 单次绑定？
   * @param {boolean} passive 不会调用 preventDefault() ?
   */
  onWheel(closure: (e: WheelEvent) => any, single: boolean = false, passive: boolean = true): void {
    if (single) {
      this.DOM.onwheel = closure;
    } else {
      this.DOM.addEventListener('wheel', (e) => {
        closure(e);
      }, { passive: passive });
    }
  }

  /**
   * 右击事件
   * @param closure 闭包
   */
  onContextmenu(closure: (e: MouseEvent) => any, single = false) {
    if (single) {
      this.DOM.onclick = closure;
    } else {
      this.DOM.addEventListener('contextmenu', (e) => {
        closure(e);
      });
    }
  }

  /**
   * @description 获取可视区域坐标
   */
  getBoundingClientRect() {
    return this.DOM.getBoundingClientRect();
  }

  /**
   * 鼠标滑过元素
   * @param closure 闭包
   */
  onMouseover(closure: (e: MouseEvent) => any, single = false) {
    if (single) {
      this.DOM.onmouseover = closure;
    } else {
      this.DOM.addEventListener('mouseover', (e) => {
        closure(e);
      });
    }
  }

  /**
   * 鼠标离开元素
   * @param closure 闭包
   */
  onMouseout(closure: (e: MouseEvent) => any, single = false) {
    if (single) {
      this.DOM.onmouseout = closure;
    } else {
      this.DOM.addEventListener('mouseout', (e) => {
        closure(e);
      });
    }
  }

  /**
   * 鼠标按下元素
   * @param closure 闭包
   */
  onMousedown(closure: (e: MouseEvent) => any, single = false) {
    if (single) {
      this.DOM.onmousedown = closure;
    } else {
      this.DOM.addEventListener('mousedown', (e) => {
        closure(e);
      });
    }
  }

  /**
   * 鼠标抬起元素
   * @param closure 闭包
   */
  onMouseup(closure: (e: MouseEvent) => any, single = false) {
    if (single) {
      this.DOM.onmouseup = closure;
    } else {
      this.DOM.addEventListener('mouseup', (e) => {
        closure(e);
      });
    }
  }

  /**
   * 鼠标移动
   * @param closure 闭包
   */
  onMousemove(closure: (e: MouseEvent) => any, single = false) {
    if (single) {
      this.DOM.onmouseup = closure;
    } else {
      this.DOM.addEventListener('mousemove', (e) => {
        closure(e);
      });
    }
  }

  /**
   * 鼠标双击
   * @param closure 闭包
   */
  onDblClick(closure: (e: MouseEvent) => any, single = false) {
    if (single) {
      this.DOM.onmouseup = closure;
    } else {
      this.DOM.addEventListener('dblclick', (e) => {
        closure(e);
      });
    }
  }
}
