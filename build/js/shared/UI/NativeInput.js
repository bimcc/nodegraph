/*
 * @LastEditors: lisushuang
 * @Description: input
 * @FilePath: /graph/src/shared/UI/NativeInput.ts
 * @Date: 2023-07-24 11:47:59
 * @LastEditTime: 2023-07-27 14:08:35
 * @Author: lisushuang
 */
import { DomBase } from "./Base";
export class NaiveInput extends DomBase {
    constructor(text, placeHolder) {
        super('input');
        Object.defineProperty(this, "DOM", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.DOM = document.createElement("input");
        this.DOM.className = 'Input';
        this.DOM.style.padding = '2px';
        this.DOM.style.width = 'calc(100% - 2px)';
        this.DOM.style.borderRadius = '5px';
        this.DOM.style.border = '1px solid transparent';
        this.DOM.style.outline = "none";
        this.DOM.setAttribute('autocomplete', 'off');
        this.DOM.addEventListener('keydown', function (e) {
            e.stopPropagation();
        });
        this.setValue(text);
        this.DOM.setAttribute("placeholder", placeHolder);
    }
    /**
     * @description: 获取本input的值
     */
    getValue() {
        return this.DOM.value;
    }
    /**
     * @description: 设置本input的值
     * @param {string} value 设置值
     */
    setValue(value) {
        this.DOM.value = value;
        return this;
    }
    onChange(closure) {
        this.DOM.addEventListener('input', (e) => {
            closure(e);
        });
    }
}
