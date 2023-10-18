/*
 * @Date: 2023-06-14 10:32:11
 * @LastEditors: asahi
 * @LastEditTime: 2023-08-04 15:57:40
 * @FilePath: \litegraph\src\event\Signal.ts
 */
export class Signal {
    constructor(id) {
        Object.defineProperty(this, "handlerList", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.id = id;
    }
    add(handler) {
        this.handlerList.push(handler);
    }
    dispatch(...param) {
        for (let handler of this.handlerList) {
            handler(...param);
        }
    }
    remove(handler) {
        const index = this.handlerList.indexOf(handler);
        if (index === -1)
            return;
        this.handlerList.splice(index, 1);
    }
}
