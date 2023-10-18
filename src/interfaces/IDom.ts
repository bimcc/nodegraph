export interface IDom {
  // id 或 class 前缀
  // prefix: string;

  // DOM元素
  DOM: HTMLElement;

  /**
   * 构造函数
   * @param tag string
   */
  // new(tag: string): IDom;

  /**
   * 设置元素ID
   * @param id string
   */
  setId(id: string): this;

  /**
   * 设置元素 CSS
   * @param style 样式
   */
  setStyle(style: Partial<CSSStyleDeclaration>): this;

  /**
   * 设置元素的定位方式
   * @param {string} position
   * @param top
   * @param left
   * @param zIndex
   * @param unit
   * @returns
   */
  setPosition(position: string, top: string | number, left: string | number, zIndex: string | number, unit: string): this;

  /**
   * 设置元素的定位方式为 absolute
   * @param top
   * @param left
   * @param zIndex
   * @param unit
   * @returns
   */
  setAbsolute(top: string | number, left: string | number, zIndex: string | number, unit: string): this;

  /**
   * @description: 设置元素相对左侧定位位置
   * @param {string} value 值
   * @param {string} unit 单位
   * @return {*}
   */
  setLeft(value: string | number, unit: string): this;

  /**
   * @description: 设置元素相对右侧定位位置
   * @param {string} value 值
   * @param {string} unit 单位
   * @return {*}
   */
  setRight(value: string | number, unit: string): this;

  /**
   * @description: 设置元素相对上方定位位置
   * @param {string} value 值
   * @param {string} unit 单位
   * @return {*}
   */
  setTop(value: string | number, unit: string): this;

  /**
   * 添加元素class
   */
  addClass(name: string): this;

  /**
   * 移除元素class
   */
  removeClass(name: string): this;

  /**
   * 替换元素class
   */
  replaceClass(oldName: string, newName: string): this;

  /**
   * 显示元素
   */
  show(): this;

  /**
   * 元素是否已显示
   */
  isShow(): boolean;

  /**
   * 隐藏元素
   */
  hide(): this;

  /**
   * 元素是否已隐藏
   */
  isHidden(): boolean;

  /**
   * 显示/隐藏切换
   */
  toggle(): this;

  /**
   * 设置元素宽度
   * @param {string | number} value 宽度
   * @param {'' | 'min' | 'max'} type 类型
   * @param {string} unit 宽度单位，默认 px
   * @returns
   */
  setWidth(value: string | number, type: '' | 'min' | 'max', unit: string): this;

  /**
   * 设置元素高度
   * @param {string | number} value 高度
   * @param {'' | 'min' | 'max'} type 类型
   * @param {string} unit 宽度单位，默认 px
   * @returns
   */
  setHeight(value: string | number, type: '' | 'min' | 'max', unit: string): this;

  /**
   * 设置元素背景颜色
   * @param {string} color 颜色
   * @returns
   */
  setBackgroundColor(color: string): this;

  /**
   * 设置元素属性
   * @param {string} qualifiedName 限定名
   * @param {string} value 值
   */
  setAttribute(qualifiedName: string, value: string): this;

  /**
   * 获取元素属性
   * @param {string} qualifiedName 限定名
   */
  getAttribute(qualifiedName: string): string | null;

  /**
   * 设置元素为可编辑
   * @param {boolean} value 值
   */
  setContentEditable(value: boolean): this;

  /**
   * 元素内边距
   * @param value
   * @returns
   */
  setPadding(value: string): this;
  /**
   * 元素内上边距
   * @param value 值
   * @returns
   */
  setPaddingTop(value: string): this;
  /**
   * 元素内下边距
   * @param value 值
   * @returns
   */
  setPaddingBottom(value: string): this;

  /**
   * 元素内左边距
   * @param value 值
   * @returns
   */
  setPaddingLeft(value: string): this;
  /**
   * 元素内右边距
   * @param value 值
   * @returns
   */
  setPaddingRight(value: string): this;

  /**
   * 元素外边距
   * @param value 值
   * @returns
   */
  setMargin(value: string): this;
  /**
   * 元素上边距
   * @param value 值
   * @returns
   */
  setMarginTop(value: string): this;
  /**
   * 元素左边距
   * @param value 值
   * @returns
   */
  setMarginLeft(value: string): this;

  /**
   * 元素右边距
   * @param value 值
   * @returns
   */
  setMarginRight(value: string): this;
  /**
   * 元素下边距
   * @param value 值
   * @returns
   */
  setMarginBottom(value: string): this;

  /**
   * @description:元素字体大小
   * @param {number} value 数值
   * @param {string} unit 单位
   * @returns
   */
  setFontSize(value: number, unit: string): this;

  /**
   * @description:新增一个子组件
   * @param {HTMLElement} child 子组件
   */
  add(child: HTMLElement | { DOM: HTMLElement;[key: string]: any } | string): this;

  /**
   * 设置阴影
   * @param {string} value 值
   * @returns
   */
  setBoxShadow(value: string): this;

  /**
   * 设置圆角
   * @param {string} value 值
   * @returns
   */
  setBorderRadius(value: string): this;

  /**
   * @description: 设置颜色
   * @param {string} color
   * @return {*}
   */
  setColor(color: string): this;

  /**
   * @description: flex布局
   * @param {*} value
   * @return {*}
   */
  setFlex(value: string): this;

  /**
   * @description: flex拆行
   * @param {*} value
   */
  setFlexWrap(value: 'nowrap' | 'wrap' | 'wrap-reverse' | 'initial' | 'inherit'): this;

  /**
   * @description: flex JustifyContent
   * @param {*} value
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
      | 'inherit'
  ): this;

  /**
   * @description: flex AlignItems
   * @param {*} value
   */
  setAlignItems(value: 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'initial' | 'inherit'): this;

  /**
   * @description: flex FlexDirection
   * @param {*} value
   * @return {*}
   */
  setFlexDirection(value: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'initial' | 'inherit'): this;
  /**
   * @description: overflow
   * @param {*} value
   */
  setOverflow(value: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit'): this;

  /**
   * @description: 是否能选取元素的文本
   * @param {*} value
   */
  setUserSelect(value: 'auto' | 'none' | 'text' | 'all'): this;

  /**
   * @description: 光标形状
   * @param {*} value
   */
  setCursor(
    value: 'auto' | 'default' | 'crosshair' | 'pointer' | 'move' | 'text' | 'wait' | 'help' | 'n-resize' | 'w-resize'): this;

  /**
   * @description: 设置元素是否对鼠标事件做出反应
   * @param {*} value
   */
  setPointerEvents(value: 'auto' | 'none' | 'initial' | 'inherit'): this;

  /**
   * 定义如何计算一个元素的总宽度和总高度
   * @param {string} value
   * @returns
   */
  setboxSizing(value: 'content-box' | 'border-box' | 'inherit'): this;

  /**
   * @description: innerText
   * @param {string} value 值
   */
  innerText(value: string): this;

  /**
   * @description: 获取innerText
   */
  getInnerText(): string;

  /**
   * 销毁
   */
  remove(): void;

  /**
   * 清空子节点
   */
  clear(): void;

  /**
   * 单击事件
   * @param closure 闭包
   */
  onClick(closure: (e: MouseEvent) => void, single: boolean): void;

  /**
   * 右击事件
   * @param closure 闭包
   */
  onContextmenu(closure: (e: MouseEvent) => void, single: boolean): void;

  /**
   * 鼠标滑过元素
   * @param closure 闭包
   */
  onMouseover(closure: (e: MouseEvent) => void, single: boolean): void;

  /**
   * 鼠标离开元素
   * @param closure 闭包
   */
  onMouseout(closure: (e: MouseEvent) => void, single: boolean): void;

  /**
   * 鼠标按下元素
   * @param closure 闭包
   */
  onMousedown(closure: (e: MouseEvent) => void, single: boolean): void;

  /**
   * 鼠标抬起元素
   * @param closure 闭包
   */
  onMouseup(closure: (e: MouseEvent) => void, single: boolean): void;

  /**
    * 鼠标移动
    * @param closure 闭包
    */
  onMousemove(closure: (e: MouseEvent) => void, single: boolean): void;
}
