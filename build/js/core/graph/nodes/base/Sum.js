/*
 * @Date: 2023-06-15 16:52:38
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-10-07 15:45:37
 * @FilePath: /graph/src/core/graph/nodes/base/Sum.ts
 */
import { Node } from "../../Node";
/**
 * @description 求和
 */
export class NSum extends Node {
    constructor() {
        super();
        Object.defineProperty(this, "isEvent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        const i0 = this.addInput({
            label: '输入',
            valueType: ['number'],
            defaultValue: 0,
            allow_input: true
        });
        const i1 = this.addInput({
            label: '输入',
            valueType: ['number'],
            defaultValue: 0,
            allow_input: true
        });
        const output = this.addOutput({
            label: "输出1",
            valueType: 'number',
            defaultValue: 1,
        });
        output.getLabel = () => {
            if (i0.link && i1.link) {
                return i0.link.origin.value + i1.link.origin.value;
            }
            else {
                return '输出';
            }
        };
    }
    initEvents() {
    }
}
Object.defineProperty(NSum, "NodeType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "sum"
}); //节点类型
Object.defineProperty(NSum, "NodeLabel", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "加法"
}); //节点显示名
Object.defineProperty(NSum, "NodePath", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "计算节点"
}); //节点路径
