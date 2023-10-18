/*
 * @LastEditors: asahi
 * @Description: 输入框
 * @FilePath: \litegraph\src\shared\UI\widgets\SelectWidget.ts
 * @Date: 2023-07-26 17:28:55
 * @LastEditTime: 2023-09-15 17:17:36
 * @Author: lisushuang
 */
import BaseWidget from "./BaseWidget";
import { Option, Select } from "../component/Select";
class SelectWidget extends BaseWidget {
    constructor(option) {
        super();
        Object.defineProperty(this, "DOM", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "selectInstance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.selectInstance = new Select(option);
        this.DOM = this.selectInstance.DOM;
    }
    onChange(closure) {
        this.selectInstance.onChange((value) => {
            closure(value);
        });
    }
    getValue() {
        return this.selectInstance.value;
    }
    setValue(value) {
        // todo 
        this.selectInstance.setValue(value);
    }
    setOptions(options) {
        this.selectInstance.dropdown.clear();
        this.selectInstance.options = options;
        options.forEach((item) => {
            const option = new Option(this.selectInstance, item);
            this.selectInstance.dropdown.add(option);
            if (this.selectInstance.hasValue(item.value)) {
                this.selectInstance.activeOptions.push(option);
                option.active();
            }
        });
    }
}
Object.defineProperty(SelectWidget, "widgetType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'select'
});
export default SelectWidget;
