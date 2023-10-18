/*
 * @LastEditors: asahi
 * @Description: widget 基类
 * @FilePath: \litegraph\src\shared\UI\widgets\BaseWidget.ts
 * @Date: 2023-07-26 15:50:13
 * @LastEditTime: 2023-09-21 17:36:40
 * @Author: lisushuang
 */
import { DomBase } from "../Base";
import { customAlphabet } from "nanoid";
class BaseWidget extends DomBase {
    /**
     * @description 创建widget的id
     * @returns
     */
    static createId() {
        const id = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10);
        return `widget_${id()}`;
    }
    constructor() {
        super();
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "label", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // 是否允许触发自定义点击事件
        Object.defineProperty(this, "isCustomClick", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "propertyName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
        this.id = BaseWidget.createId();
    }
    getLabel() {
        if (this.label !== null) {
            return this.label;
        }
        else {
            return "";
        }
    }
}
export default BaseWidget;
