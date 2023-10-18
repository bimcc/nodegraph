import { Node } from '../..';
/**
 * @description 三元运算符
 */
export class Ternary extends Node {
    constructor() {
        super();
        this.setProperty("__function__", "Ternary");
        this.addInput({
            label: '条件A',
            valueType: ['string'],
        });
        this.addInput({
            label: '成立值B',
            valueType: ['any'],
        });
        this.addInput({
            label: '不成立值C',
            valueType: ['any'],
        });
        this.addOutput({ label: '结果', valueType: 'any' });
    }
}
Object.defineProperty(Ternary, "NodeType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'Ternary'
}); //节点类型
Object.defineProperty(Ternary, "NodeLabel", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: '三元运算'
}); //节点显示名
Object.defineProperty(Ternary, "NodePath", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: '基础节点'
}); //节点路径
