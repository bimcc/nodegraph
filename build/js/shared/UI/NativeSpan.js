/*
 * @Author: ttheitao
 * @Description: span
 * @Date: 2023-04-28 14:11:24
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-08-25 17:38:41
 */
import { DomBase } from "./Base";
export class NativeSpan extends DomBase {
    constructor(text = "") {
        super('span');
        if (text) {
            this.DOM.innerText = text;
        }
    }
}
