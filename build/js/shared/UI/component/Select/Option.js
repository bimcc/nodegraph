/*
 * @Author: zw1995
 * @Description:
 * @Date: 2023-07-28 16:08:38
 * @LastEditors: zw1995
 * @LastEditTime: 2023-07-28 16:08:38
 */
import { DomBase } from "../../Base";
export class Option extends DomBase {
    constructor(select, props) {
        super();
        Object.defineProperty(this, "label", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.value = props.value;
        this.label = props.label;
        this.addClass('select-option').setPadding('5px 10px').setFontSize(14).setBorderRadius();
        this.setStyle({
            pointerEvents: 'visible'
        });
        this.DOM.innerText = this.label;
        this.onMouseover(() => {
            this.setBackgroundColor('#f3f4f5');
        });
        this.onMouseout(() => {
            this.setBackgroundColor('#fff');
        });
        this.onMousedown((e) => {
            e.stopPropagation();
            select.checked(this);
        });
    }
    active(status = true) {
        if (status) {
            this.setColor('#409EFF');
        }
        else {
            this.setColor('#303133');
        }
    }
}
