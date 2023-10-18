/*
 * @LastEditors: asahi
 * @Description: 输入框
 * @FilePath: \litegraph\src\shared\UI\widgets\InputWidget.ts
 * @Date: 2023-07-26 17:28:55
 * @LastEditTime: 2023-09-15 17:18:23
 * @Author: lisushuang
 */
import BaseWidget from "./BaseWidget";
class InputWidget extends BaseWidget {
    constructor(option) {
        var _a;
        super();
        Object.defineProperty(this, "DOM", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.DOM = document.createElement("input");
        this.DOM.type = (_a = option === null || option === void 0 ? void 0 : option.type) !== null && _a !== void 0 ? _a : 'text';
        if (option === null || option === void 0 ? void 0 : option.placeholder) {
            this.DOM.placeholder = option.placeholder;
        }
        if (option === null || option === void 0 ? void 0 : option.title) {
            this.DOM.title = option.title;
        }
        if (option === null || option === void 0 ? void 0 : option.value) {
            this.DOM.value = option.value;
        }
        this.setStyle({
            // width:"calc(100% - 8px)",
            flex: "1",
            border: "0",
            marginLeft: "4px",
            borderRadius: "5px",
            outline: "none",
            textIndent: "2px",
            fontSize: "14px",
            height: "20px",
            color: "black"
        });
        this.onMousedown((e) => {
            e.stopPropagation();
        });
    }
    onChange(closure) {
        this.DOM.addEventListener('input', () => {
            closure(this.DOM.value);
        });
    }
    getValue() {
        return this.DOM.value;
    }
    setValue(value) {
        this.DOM.value = value;
    }
}
Object.defineProperty(InputWidget, "widgetType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'input'
});
export default InputWidget;
