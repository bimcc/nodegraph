import { Node } from '../..';
/**
 * @description 数字
 */
export class Number extends Node {
    constructor() {
        super();
        Object.defineProperty(this, "numberInput", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "NotAutoRegister", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        this.setProperty("__function__", "ConstantNumber");
        this.setInitProperty("value", 0);
        this.addOutput({ label: 'value', valueType: 'number' });
        this.numberInput = this.addWidget('input', {
            type: 'number',
            placeholder: '请输入数字',
        }, '数字', 'value');
    }
    onExecute() {
        this.setOutputData(0, parseFloat(this.numberInput.getValue()));
    }
}
Object.defineProperty(Number, "NodeType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'ConstantNumber'
}); //节点类型
Object.defineProperty(Number, "NodeLabel", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: '数字'
}); //节点显示名
Object.defineProperty(Number, "NodePath", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: '基础节点'
}); //节点路径
