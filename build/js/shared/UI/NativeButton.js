/*
 * @LastEditors: lisushuang
 * @Description: input
 * @FilePath: /graph/src/shared/UI/NativeButton.ts
 * @Date: 2023-07-24 11:47:59
 * @LastEditTime: 2023-09-26 15:41:35
 * @Author: lisushuang
 */
import { DomBase } from "./Base";
export class NativeButton extends DomBase {
    constructor(text) {
        super('button');
        Object.defineProperty(this, "DOM", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.DOM = document.createElement("button");
        this.setStyle({
            minWidth: '50px',
            height: '30px',
            borderRadius: '4px',
            cursor: 'pointer',
            color: "black",
            paddingLeft: "5px",
            paddingRight: "5px"
        });
        this.add(text);
    }
}
