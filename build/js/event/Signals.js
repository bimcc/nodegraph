/*
 * @Date: 2023-06-14 10:32:37
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-09-27 16:13:43
 * @FilePath: /graph/src/event/Signals.ts
 */
import { Signal as BaseSignal } from '../event';
import { CustomEvetns, GraphEventTypes } from "../types";
/**
 * @description 多信号管理
 */
export class Signals {
    constructor() {
        Object.defineProperty(this, "signalMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "readOnly", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    create(id) {
        const bs = new BaseSignal(id);
        this.signalMap[id] = bs;
        return bs;
    }
    delete(id) {
        delete this.signalMap[id];
    }
    get(id) {
        return this.signalMap[id];
    }
    add(id, handler) {
        if (!this.signalMap[id])
            return;
        this.signalMap[id].add(handler);
    }
    dispatch(id, ...param) {
        if (!this.signalMap[id])
            return;
        // 禁用模式下 事件白名单
        const whitelist = [
            GraphEventTypes.DragViewMove, GraphEventTypes.ViewScale,
            CustomEvetns.Widget, CustomEvetns.Node
        ];
        // @ts-ignore
        if (!this.readOnly || whitelist.indexOf(id) > -1) {
            this.signalMap[id].dispatch(...param);
        }
    }
    remove(id, handler) {
        if (!this.signalMap[id])
            return;
        this.signalMap[id].remove(handler);
    }
    setReadOnly(value) {
        this.readOnly = value;
    }
}
