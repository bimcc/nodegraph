/*
 * @Date: 2023-08-07 15:23:29
 * @LastEditors: asahi
 * @LastEditTime: 2023-09-21 15:55:42
 * @FilePath: \litegraph\src\core\graph\nodes\base\SubGraphOutput.ts
 */
import { Node, } from "../../../graph";
/**
 * @description  子图插槽是输出，子图内部是输入
 */
export class NSubGraphOutput extends Node {
    constructor() {
        super();
        Object.defineProperty(this, "parentSlot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    /**
     * @description 设置标题显示值
     * @override
     * @returns
     */
    getLabel() {
        var _a, _b;
        return (_b = (_a = this.parentSlot) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : '子图输入';
    }
    serialize() {
        var _a, _b;
        const result = super.serialize();
        result['subGraphSlotIndex'] = (_a = this.parentSlot) === null || _a === void 0 ? void 0 : _a.index;
        result['subGraphSlotNodeId'] = (_b = this.parentSlot) === null || _b === void 0 ? void 0 : _b.node.id;
        return result;
    }
    deserialize(data) {
        var _a, _b;
        if ((!data['subGraphSlotIndex'] && data['subGraphSlotIndex'] !== 0) || !data['subGraphSlotNodeId'])
            return console.warn('序列化子图插槽失败！');
        const slotIndex = data['subGraphSlotIndex'];
        const nid = data['subGraphSlotNodeId'];
        const parentGraph = (_b = (_a = this.graph) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.graph;
        const node = parentGraph === null || parentGraph === void 0 ? void 0 : parentGraph.getNode(nid); //子图的父图对应的node
        if (!node)
            return console.warn('序列化子图插槽失败！');
        const slot = node.outputs[slotIndex];
        if (!slot)
            return console.warn('序列化子图插槽失败！');
        this.setParentSlot(slot);
    }
    onRemove() {
        if (!this.parentSlot)
            return;
        this.parentSlot.subGraphNode = null;
    }
    setParentSlot(slot) {
        this.inputs = [];
        this.parentSlot = slot;
        this.addInput({
            label: this.parentSlot.label,
            valueType: [this.parentSlot.valueType],
        });
        this.parentSlot.subGraphNode = this;
    }
}
Object.defineProperty(NSubGraphOutput, "NodeType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "subGraphOutput"
}); //节点类型
Object.defineProperty(NSubGraphOutput, "NodeLabel", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "子图输入"
}); //节点显示名
Object.defineProperty(NSubGraphOutput, "NodePath", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "子图节点"
}); // 节点路径
Object.defineProperty(NSubGraphOutput, "NotAddContextMenu", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: true
}); //不添加到右键菜单
