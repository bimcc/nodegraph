/*
 * @LastEditors: lisushuang
 * @Description: canvas 节点
 * @FilePath: /graph/src/shared/UI/NativeCanvas.ts
 * @Date: 2023-07-25 13:55:16
 * @LastEditTime: 2023-09-05 18:33:38
 * @Author: lisushuang
 */
import { DomBase } from "./Base";
export class NativeCanvas extends DomBase {
    constructor() {
        super("canvas");
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.ctx = this.DOM.getContext("2d");
        this.ctx.translate(0.5, 0.5);
    }
}
