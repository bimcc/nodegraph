/*
 * @LastEditors: lisushuang
 * @Description: Switch 开关
 * @FilePath: /graph/src/shared/UI/widgets/SwitchWidget.ts
 * @Date: 2023-07-31 10:28:55
 * @LastEditTime: 2023-08-25 17:50:21
 * @Author: zw1995
 */
import BaseWidget from "./BaseWidget";
import { Switch } from "../component/Switch";
import { NativeDiv } from "../NativeDiv";
class SwitchWidget extends BaseWidget {
    constructor(option) {
        super();
        Object.defineProperty(this, "DOM", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "switchInstance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.switchInstance = new Switch(option);
        let formItem = new NativeDiv();
        formItem.setStyle({
            display: 'flex',
            justifyContent: 'space-between'
        });
        if (option === null || option === void 0 ? void 0 : option.label) {
            let label = new NativeDiv();
            let labelText = option === null || option === void 0 ? void 0 : option.label;
            label.innerText(labelText);
            label.setStyle({
                fontSize: '14px',
                lineHeight: '25px',
                whiteSpace: 'nowrap',
                textIndent: '5px',
                marginRight: '10px'
            });
            formItem.add(label);
        }
        formItem.add(this.switchInstance);
        this.DOM = formItem.DOM;
        this.DOM.addEventListener("dblclick", (e) => {
            e.stopPropagation();
        });
    }
    onChange(closure) {
        this.switchInstance.onChange((value) => {
            closure(value);
        });
    }
    setValue(value) {
        this.switchInstance.setValue(value);
    }
    getValue() {
        return this.switchInstance.value;
    }
}
Object.defineProperty(SwitchWidget, "widgetType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'switch'
});
export default SwitchWidget;
