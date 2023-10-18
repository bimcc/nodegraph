/*
 * @Date: 2023-08-07 15:23:29
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-10-07 15:44:48
 * @FilePath: /graph/src/core/graph/nodes/base/SubGraphInput.ts
 */
import { Node, } from "../../../graph";
/**
 * @description 子图插槽是输入，子图内部是输出
 */
export class NSubGraphInput extends Node {
    constructor() {
        super();
        Object.defineProperty(this, "parentSlot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.setOption('notClone', true);
    }
    /**
     * @description 设置标题显示值
     * @override
     * @returns
     */
    getLabel() {
        var _a, _b;
        return (_b = (_a = this.parentSlot) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : '子图输出';
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
        const slot = node.inputs[slotIndex];
        if (!slot)
            return console.warn('序列化子图插槽失败！');
        this.setParentSlot(slot);
    }
    onRemove() {
        if (!this.parentSlot)
            return;
        this.parentSlot.subGraphNode.splice(this.parentSlot.subGraphNode.indexOf(this), 1);
    }
    setParentSlot(slot) {
        this.outputs = [];
        this.parentSlot = slot;
        this.addOutput({
            label: this.parentSlot.label,
            valueType: this.parentSlot.valueType[0],
        });
        this.parentSlot.subGraphNode.push(this);
    }
}
Object.defineProperty(NSubGraphInput, "NodeType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "subGraphInput"
}); //节点类型
Object.defineProperty(NSubGraphInput, "NodeLabel", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "子图输出"
}); //节点显示名
Object.defineProperty(NSubGraphInput, "NodePath", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "子图节点"
}); // 节点路径
Object.defineProperty(NSubGraphInput, "NotAddContextMenu", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: true
}); //不添加到右键菜单
