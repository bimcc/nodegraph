/*
 * @Date: 2023-08-07 15:23:29
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-10-07 15:44:48
 * @FilePath: /graph/src/core/graph/nodes/base/SubGraphInput.ts
 */
import {Node, NodeInput,} from "../../../graph";
import {SerNode} from "../../../interfaces";
import {NodeType} from "../../../types";

/**
 * @description 子图插槽是输入，子图内部是输出
 */
export class NSubGraphInput extends Node {
  static override NodeType: NodeType = "subGraphInput"; //节点类型
  static override NodeLabel: string = "子图输出"; //节点显示名
  static override NodePath: string = "子图节点"; // 节点路径
  static override NotAddContextMenu: boolean = true; //不添加到右键菜单

  parentSlot: NodeInput | null = null;

  constructor() {
    super();
    this.setOption('notClone', true);
  }

  /**
   * @description 设置标题显示值
   * @override
   * @returns
   */
  override getLabel() {
    return this.parentSlot?.label ?? '子图输出';
  }

  override serialize(): SerNode {
    const result = super.serialize();
    result['subGraphSlotIndex'] = this.parentSlot?.index;
    result['subGraphSlotNodeId'] = this.parentSlot?.node.id;
    return result;
  }

  override deserialize(data: SerNode): void {
    if ((!data['subGraphSlotIndex'] && data['subGraphSlotIndex'] !== 0) || !data['subGraphSlotNodeId']) return console.warn('序列化子图插槽失败！');

    const slotIndex = data['subGraphSlotIndex'];
    const nid = data['subGraphSlotNodeId'];
    const parentGraph = this.graph?.parentNode?.graph;
    const node = parentGraph?.getNode(nid); //子图的父图对应的node
    if (!node) return console.warn('序列化子图插槽失败！');

    const slot = node.inputs[slotIndex];
    if (!slot) return console.warn('序列化子图插槽失败！');

    this.setParentSlot(slot);
  }

  override onRemove() {
    if (!this.parentSlot) return;
    this.parentSlot.subGraphNode.splice(this.parentSlot.subGraphNode.indexOf(this), 1);
  }

  setParentSlot(slot: NodeInput) {
    this.outputs = [];
    this.parentSlot = slot;

    this.addOutput({
      label: this.parentSlot.label,
      valueType: this.parentSlot.valueType[0],
    });

    this.parentSlot.subGraphNode.push(this);
  }
}  