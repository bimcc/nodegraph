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
class WidgetsManager {
    /**
     * 初始化默认widget
     */
    static initDefaultWidget() {
        const list = [ArrayWidget, GraphWidget, InputWidget, SelectWidget, SwitchWidget];
        for (const key in list) {
            WidgetsManager.registerWidget(list[key]);
        }
    }
    /**
     * 注册widget
     * @param widgetClass
     */
    static registerWidget(widgetClass) {
        if (!(widgetClass.prototype instanceof BaseWidget))
            return;
        if (WidgetsManager.widgetsTypeMap[widgetClass.widgetType])
            return;
        WidgetsManager.widgetsTypeMap[widgetClass.widgetType] = widgetClass;
    }
    /**
     * 创建Widget
     * @param widgetType
     * @param option
     */
    static createWidget(widgetType, option = {}) {
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
Object.defineProperty(WidgetsManager, "widgetsTypeMap", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {}
});
export default WidgetsManager;
// WidgetsManager.initDefaultWidget()
