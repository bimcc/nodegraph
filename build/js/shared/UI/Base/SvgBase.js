export class SvgBase {
    constructor(type) {
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
        this.DOM = document.createElementNS('http://www.w3.org/2000/svg', type);
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
    /**
   * @description:新增一个子组件
   * @param {HTMLElement} child 子组件
   */
    add(child) {
        this.DOM.appendChild(child.DOM);
        return this;
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
   * 销毁
   */
    remove() {
        this.DOM.remove();
    }
}
