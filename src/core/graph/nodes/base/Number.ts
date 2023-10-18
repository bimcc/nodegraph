import {Node} from '../..';
import {NodeType} from '../../../types';
import InputWidget from "../../../../shared/UI/widgets/InputWidget";

/**
 * @description 数字
 */
export class Number extends Node {
  static override NodeType: NodeType = 'ConstantNumber'; //节点类型
  static override NodeLabel: string = '数字'; //节点显示名
  static override NodePath: string = '基础节点'; //节点路径

  numberInput: InputWidget

  NotAutoRegister = true

  constructor() {
    super();

    this.setProperty("__function__", "ConstantNumber");
    this.setInitProperty("value", 0);

    this.addOutput({ label: 'value', valueType: 'number' });

    this.numberInput = this.addWidget('input', {
      type: 'number',
      placeholder: '请输入数字',
    },'数字','value') as InputWidget;
  }

  override onExecute() {
    this.setOutputData(0, parseFloat(this.numberInput.getValue()));
  }
}
