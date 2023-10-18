/*
 * @Date: 2023-06-15 16:52:38
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-10-07 15:45:37
 * @FilePath: /graph/src/core/graph/nodes/base/Sum.ts
 */

import {Node} from "../../Node";
import {NodeType} from "../../../types";

/**
 * @description 求和
 */
export class NSum extends Node {
  static override NodeType: NodeType = "sum"; //节点类型
  static override NodeLabel: string = "加法"; //节点显示名
  static override NodePath: string = "计算节点"; //节点路径
  override isEvent: boolean = true;

  constructor() {
    
    super();

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
      } else {
        return '输出'
      }
    }
  }

  override initEvents(): void {

  }
}
