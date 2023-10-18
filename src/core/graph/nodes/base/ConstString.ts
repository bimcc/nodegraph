import {Node} from '../..';
import {NodeType} from '../../../types';
import InputWidget from "../../../../shared/UI/widgets/InputWidget";

/**
 * @description 字符串
 */
export class ConstString extends Node {
  static override NodeType: NodeType = 'ConstString'; //节点类型
  static override NodeLabel: string = '字符串'; //节点显示名
  static override NodePath: string = '基础节点'; //节点路径

  strInput: InputWidget

  constructor() {
    super();

    this.setProperty("__function__", "ConstString");
    this.setInitProperty("value", "");

    this.addOutput({ label: '字符串', valueType: 'string' });

    this.strInput = this.addWidget('input', {
      placeholder: '请输入字符串'
    },"字符串","value") as InputWidget;
  }

  override onExecute() {
    this.setOutputData(0, this.strInput.getValue());
  }
}
