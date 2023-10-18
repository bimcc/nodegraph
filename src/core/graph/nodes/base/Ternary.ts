import {Node} from '../..';
import {NodeType} from '../../../types';

/**
 * @description 三元运算符
 */
export class Ternary extends Node {
  static override NodeType: NodeType = 'Ternary'; //节点类型
  static override NodeLabel: string = '三元运算'; //节点显示名
  static override NodePath: string = '基础节点'; //节点路径

  constructor() {
    super();

    this.setProperty("__function__", "Ternary");

    this.addInput({
      label: '条件A',
      valueType: ['string'],
    })

    this.addInput({
      label: '成立值B',
      valueType: ['any'],
    })

    this.addInput({
      label: '不成立值C',
      valueType: ['any'],
    })

    this.addOutput({ label: '结果', valueType: 'any' });
  }
}
