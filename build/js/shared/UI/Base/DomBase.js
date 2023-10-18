/*
 * @Date: 2023-07-12 17:42:06
 * @LastEditors: asahi
 * @LastEditTime: 2023-08-28 16:35:08
 * @FilePath: \litegraph\src\shared\UI\Base\DomBase.ts
 */
import { isNumber } from "../../../Utils";
export class DomBase {
    constructor(tag = 'div') {
        /**
         * DOM元素
         * @val DOM
         */
        Object.defineProperty(this, "DOM", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.DOM = document.createElement(tag);
    }
    /**
     * 设置元素ID
     * @param id
     */
    setId(id) {
        this.DOM.id = `${DomBase.prefix}${id}`;
        return this;
    }
    /**
     * @description 获取宽度
     */
    getClientWidth() {
        return this.DOM.clientWidth;
    }
    /**
     * @description 获取高度
     */
    getClientHeight() {
        return this.DOM.clientHeight;
    }
    /**
     * @description 获取相对高度
     */
    getOffsetHeight() {
        return this.DOM.offsetHeight;
    }
    /**
     * @description 获取相对宽度
     */
    getOffsetWidth() {
        return this.DOM.offsetWidth;
    }
    getOffsetLeft() {
        return this.DOM.offsetLeft;
    }
    getOffsetTop() {
        return this.DOM.offsetTop;
    }
    /**
     * 设置元素 CSS
     * @param style 样式
     */
    setStyle(style) {
        for (let item in style) {
            this.DOM.style[item] = style[item];
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
    setPosition(position = 'absolute', top = 0, left = 0, zIndex = 0, unit = 'px') {
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
    setAbsolute(top = 0, left = 0, zIndex = 0, unit = 'px') {
        return this.setPosition('absolute', top, left, zIndex, unit);
    }
    /**
     * @description: 设置元素相对左侧定位位置
     * @param {string} value 值
     * @param {string} unit 单位
     * @return {*}
     */
    setLeft(value, unit = 'px') {
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
    setRight(value, unit = 'px') {
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
    setTop(value, unit = 'px') {
        return this.setStyle({
            top: isNumber(value) ? `${value}${unit}` : value,
        });
    }
    /**
     * 添加元素class
     */
    addClass(name) {
        this.DOM.classList.add(`${DomBase.prefix}${name}`);
        return this;
    }
    /**
     * 移除元素class
     */
    removeClass(name) {
        this.DOM.classList.remove(`${DomBase.prefix}${name}`);
        return this;
    }
    /**
     * 替换元素class
     */
    replaceClass(oldName, newName) {
        this.DOM.classList.replace(`${DomBase.prefix}${oldName}`, `${DomBase.prefix}${newName}`);
        return this;
    }
    /**
     * 显示元素
     */
    show() {
        return this.setStyle({ display: 'block' });
    }
    /**
     * 元素是否已显示
     */
    isShow() {
        return this.DOM.style.display === 'block';
    }
    /**
     * 隐藏元素
     */
    hide() {
        return this.setStyle({ display: 'none' });
    }
    /**
     * 元素是否已隐藏
     */
    isHidden() {
        return this.DOM.style.display === 'none';
    }
    /**
     * 显示/隐藏切换
     */
    toggle() {
        if (this.DOM.style.display === 'none') {
            this.show();
        }
        else {
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
    setWidth(value, type = '', unit = 'px') {
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
    setHeight(value, type = '', unit = 'px') {
        return this.setStyle({
            [`${type}${type ? 'H' : 'h'}eight`]: isNumber(value) ? `${value}${unit}` : value,
        });
    }
    /**
     * 设置元素背景颜色
     * @param {string} color 颜色
     * @returns
     */
    setBackgroundColor(color) {
        return this.setStyle({
            backgroundColor: color,
        });
    }
    /**
     * 设置元素属性
     * @param {string} qualifiedName 限定名
     * @param {string} value 值
     */
    setAttribute(qualifiedName, value) {
        this.DOM.setAttribute(qualifiedName, value);
        return this;
    }
    removeAttribute(qualifiedName) {
        this.DOM.removeAttribute(qualifiedName);
    }
    /**
     * 获取元素属性
     * @param {string} qualifiedName 限定名
     */
    getAttribute(qualifiedName) {
        return this.DOM.getAttribute(qualifiedName);
    }
    /**
     * 设置元素为可编辑
     * @param {boolean} value 值
     */
    setContentEditable(value = false) {
        this.DOM.setAttribute('contentEditable', value.toString());
        return this;
    }
    /**
     * 元素内边距
     * @param value
     * @returns
     */
    setPadding(value) {
        return this.setStyle({ padding: value });
    }
    /**
     * 元素内上边距
     * @param value 值
     * @returns
     */
    setPaddingTop(value) {
        return this.setStyle({ paddingTop: value });
    }
    /**
     * 元素内下边距
     * @param value 值
     * @returns
     */
    setPaddingBottom(value) {
        return this.setStyle({ paddingBottom: value });
    }
    /**
     * 元素内左边距
     * @param value 值
     * @returns
     */
    setPaddingLeft(value) {
        return this.setStyle({ paddingLeft: value });
    }
    /**
     * 元素内右边距
     * @param value 值
     * @returns
     */
    setPaddingRight(value) {
        return this.setStyle({ paddingRight: value });
    }
    /**
     * 元素外边距
     * @param value 值
     * @returns
     */
    setMargin(value) {
        return this.setStyle({ margin: value });
    }
    /**
     * 元素上边距
     * @param value 值
     * @returns
     */
    setMarginTop(value) {
        return this.setStyle({ marginTop: value });
    }
    /**
     * 元素左边距
     * @param value 值
     * @returns
     */
    setMarginLeft(value) {
        return this.setStyle({ marginLeft: value });
    }
    /**
     * 元素右边距
     * @param value 值
     * @returns
     */
    setMarginRight(value) {
        return this.setStyle({ marginRight: value });
    }
    /**
     * 元素下边距
     * @param value 值
     * @returns
     */
    setMarginBottom(value) {
        return this.setStyle({ marginBottom: value });
    }
    /**
     * @description:元素字体大小
     * @param {number} value 数值
     * @param {string} unit 单位
     * @returns
     */
    setFontSize(value, unit = 'px') {
        return this.setStyle({
            fontSize: `${value}${unit}`,
        });
    }
    /**
     * @description:新增一个子组件
     * @param {HTMLElement} child 子组件
     */
    add(child) {
        var _a;
        if (typeof child === 'string') {
            this.DOM.appendChild(document.createTextNode(child));
        }
        else {
            // @ts-ignore
            this.DOM.appendChild((_a = child.DOM) !== null && _a !== void 0 ? _a : child);
        }
        return this;
    }
    /**
     * 设置阴影
     * @param {string} value 值
     * @returns
     */
    setBoxShadow(value = '#ccc 0px 0px 10px 1px') {
        return this.setStyle({
            boxShadow: value,
        });
    }
    /**
     * 设置圆角
     * @param {string} value 值
     * @returns
     */
    setBorderRadius(value = '5px') {
        return this.setStyle({
            borderRadius: value,
        });
    }
    /**
     * @description: 设置颜色
     * @param {string} color
     * @return {*}
     */
    setColor(color) {
        return this.setStyle({ color });
    }
    /**
     * @description: flex布局
     * @param {*} value
     * @return {*}
     */
    setFlex(value = 'flex') {
        return this.setStyle({ display: value });
    }
    /**
     * @description: flex拆行
     * @param {*} value
     * @return {*}
     */
    setFlexWrap(value = 'nowrap') {
        return this.setStyle({ flexWrap: value });
    }
    /**
     * @description: flex JustifyContent
     * @param {*} value
     * @return {*}
     */
    setJustifyContent(value = 'flex-start') {
        return this.setStyle({ justifyContent: value });
    }
    /**
     * @description: flex AlignItems
     * @param {*} value
     * @return {*}
     */
    setAlignItems(value = 'center') {
        return this.setStyle({ alignItems: value });
    }
    /**
     * @description: flex FlexDirection
     * @param {*} value
     * @return {*}
     */
    setFlexDirection(value) {
        return this.setStyle({ flexDirection: value });
    }
    /**
     * @description: overflow
     * @param {*} value
     * @return {*}
     */
    setOverflow(value = 'visible') {
        return this.setStyle({ overflow: value });
    }
    /**
     * @description: 是否能选取元素的文本
     * @param {*} value
     * @return {*}
     */
    setUserSelect(value = 'auto') {
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
    setCursor(value = 'auto') {
        return this.setStyle({ cursor: value });
    }
    /**
     * @description: 设置元素是否对鼠标事件做出反应
     * @param {*} value
     * @return {*}
     */
    setPointerEvents(value = 'auto') {
        return this.setStyle({ pointerEvents: value });
    }
    /**
     * 定义如何计算一个元素的总宽度和总高度
     * @param {string} value
     * @returns
     */
    setboxSizing(value = 'content-box') {
        return this.setStyle({ boxSizing: value });
    }
    /**
     * @description: innerText
     * @param {string} value 值
     * @return {*}
     */
    innerText(value) {
        this.DOM.innerText = value;
        return this;
    }
    /**
     * @description: 获取innerText
     * @param {string} value 值
     * @return {*}
     */
    getInnerText() {
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
    onClick(closure, single = false) {
        if (single) {
            this.DOM.onclick = closure;
        }
        else {
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
    onWheel(closure, single = false, passive = true) {
        if (single) {
            this.DOM.onwheel = closure;
        }
        else {
            this.DOM.addEventListener('wheel', (e) => {
                closure(e);
            }, { passive: passive });
        }
    }
    /**
     * 右击事件
     * @param closure 闭包
     */
    onContextmenu(closure, single = false) {
        if (single) {
            this.DOM.onclick = closure;
        }
        else {
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
    onMouseover(closure, single = false) {
        if (single) {
            this.DOM.onmouseover = closure;
        }
        else {
            this.DOM.addEventListener('mouseover', (e) => {
                closure(e);
            });
        }
    }
    /**
     * 鼠标离开元素
     * @param closure 闭包
     */
    onMouseout(closure, single = false) {
        if (single) {
            this.DOM.onmouseout = closure;
        }
        else {
            this.DOM.addEventListener('mouseout', (e) => {
                closure(e);
            });
        }
    }
    /**
     * 鼠标按下元素
     * @param closure 闭包
     */
    onMousedown(closure, single = false) {
        if (single) {
            this.DOM.onmousedown = closure;
        }
        else {
            this.DOM.addEventListener('mousedown', (e) => {
                closure(e);
            });
        }
    }
    /**
     * 鼠标抬起元素
     * @param closure 闭包
     */
    onMouseup(closure, single = false) {
        if (single) {
            this.DOM.onmouseup = closure;
        }
        else {
            this.DOM.addEventListener('mouseup', (e) => {
                closure(e);
            });
        }
    }
    /**
     * 鼠标移动
     * @param closure 闭包
     */
    onMousemove(closure, single = false) {
        if (single) {
            this.DOM.onmouseup = closure;
        }
        else {
            this.DOM.addEventListener('mousemove', (e) => {
                closure(e);
            });
        }
    }
    /**
     * 鼠标双击
     * @param closure 闭包
     */
    onDblClick(closure, single = false) {
        if (single) {
            this.DOM.onmouseup = closure;
        }
        else {
            this.DOM.addEventListener('dblclick', (e) => {
                closure(e);
            });
        }
    }
}
// id 或 class 前缀
Object.defineProperty(DomBase, "prefix", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'ra-graph-'
});
