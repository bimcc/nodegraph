/*
 * @LastEditors: asahi
 * @Description: widget 基类
 * @FilePath: \litegraph\src\shared\UI\widgets\BaseWidget.ts
 * @Date: 2023-07-26 15:50:13
 * @LastEditTime: 2023-09-21 17:36:40
 * @Author: lisushuang
 */

import {ContextMenuDivider, IContextMenuItem, IKeyValue} from "../../../interfaces";
import {DomBase} from "../Base";
import {customAlphabet} from "nanoid";

abstract class BaseWidget extends DomBase {

  id: string;

  label: string | null = null;

  // 是否允许触发自定义点击事件
  isCustomClick: boolean = false;

  propertyName:string = ''

  /**
   * @description 创建widget的id
   * @returns
   */
  static createId(): string {
    const id = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10);
    return `widget_${id()}`;
  }

  constructor() {
    super();
    this.id = BaseWidget.createId();
  }

  abstract getValue(): any

  abstract setValue(value: any): void

  abstract onChange(closure: (value: any) => void): void

  getLabel(): string {
    if (this.label !== null) {
      return this.label
    } else {
      return "";
    }
  }

  /**
   * 右键菜单内容
   */
  getContextMenu?(): Array<IContextMenuItem | ContextMenuDivider>
}

export default BaseWidget;