
export abstract class SvgBase{
    /**
     * DOM元素
     * @val DOM
     */
    public DOM: SVGElement;

    constructor( type : string ){
        this.DOM = document.createElementNS('http://www.w3.org/2000/svg', type);
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

    /**
   * @description:新增一个子组件
   * @param {HTMLElement} child 子组件
   */
    add( child : SvgBase ) {
        this.DOM.appendChild( child.DOM );
        return this;
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
   * 销毁
   */
    remove() {
            this.DOM.remove();
    }

}