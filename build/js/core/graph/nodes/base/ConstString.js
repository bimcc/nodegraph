import { Node } from '../..';
/**
 * @description 字符串
 */
export class ConstString extends Node {
    constructor() {
        super();
        Object.defineProperty(this, "strInput", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.setProperty("__function__", "ConstString");
        this.setInitProperty("value", "");
        this.addOutput({ label: '字符串', valueType: 'string' });
        this.strInput = this.addWidget('input', {
            placeholder: '请输入字符串'
        }, "字符串", "value");
    }
    onExecute() {
        this.setOutputData(0, this.strInput.getValue());
    }
}
Object.defineProperty(ConstString, "NodeType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'ConstString'
}); //节点类型
Object.defineProperty(ConstString, "NodeLabel", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: '字符串'
}); //节点显示名
Object.defineProperty(ConstString, "NodePath", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: '基础节点'
}); //节点路径
