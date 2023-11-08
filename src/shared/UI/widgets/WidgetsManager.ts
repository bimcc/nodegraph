/*
 * @LastEditors: lisushuang
 * @Description: 微件管理器
 * @FilePath: /bimcc-graph/src/shared/UI/widgets/WidgetsManager.ts
 * @Date: 2023-10-07 15:36:41
 * @LastEditTime: 2023-11-08 15:22:35
 * @Author: lisushuang
 */

import ArrayWidget from "./ArrayWidget";
import BaseWidget from "./BaseWidget";
import GraphWidget from "./GraphWidget";
import InputWidget from "./InputWidget";
import SelectWidget from "./SelectWidget";
import SwitchWidget from "./SwitchWidget";

export default class WidgetsManager {

  static widgetsTypeMap: { [key: string]: any } = {};

  /**
   * 初始化默认widget
   */
  static initDefaultWidget() {
    const list: Array<any> = [ArrayWidget, GraphWidget, InputWidget, SelectWidget, SwitchWidget];
    for (const key in list) {
      WidgetsManager.registerWidget(list[key]);
    }
  }

  /**
   * 注册widget
   * @param widgetClass
   */
  static registerWidget(widgetClass: any) {
    if (!(widgetClass.prototype instanceof BaseWidget)) return;
    if (WidgetsManager.widgetsTypeMap[widgetClass.widgetType]) return;
    WidgetsManager.widgetsTypeMap[widgetClass.widgetType] = widgetClass;
  }

  /**
   * 创建Widget
   * @param widgetType
   * @param option
   */
  static createWidget(widgetType: string, option: any = {}): BaseWidget | null {
    let widgetClass = WidgetsManager.widgetsTypeMap[widgetType];
    if (!widgetType || !widgetClass) {
      // widget类型并未注册
      console.warn(`widget类型:[${widgetType}],并未注册`);
      // @mark 未注册的widget默认返回inputwidget
      return new InputWidget(option);
    }
    return new widgetClass(option);
  }
}

// WidgetsManager.initDefaultWidget()