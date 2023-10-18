import BaseWidget from "./BaseWidget";
import { NativeDiv } from "../NativeDiv";
import { NativeButton } from "../NativeButton";
import { NaiveInput } from "../NativeInput";
/**
 * @description 输入数组类型,其结果值(,)分割
 */
class ArrayWidget extends BaseWidget {
    constructor(option) {
        super();
        Object.defineProperty(this, "DOM", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputDIVs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "closure", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (value) => {
            }
        });
        this.inputDIVs = new NativeDiv();
        this.inputDIVs.setFlex();
        this.inputDIVs.setFlexDirection('column');
        if (option === null || option === void 0 ? void 0 : option.value) {
            let valueArr = [];
            if (typeof option.value === 'string') {
                valueArr = option.value.split(',');
            }
            else if (typeof option.value === 'object') {
                valueArr = option.value;
            }
            valueArr.forEach((value) => {
                this.addInputDIV(String(value));
            });
        }
        else {
            this.addInputDIV();
        }
        let ButtonDIV = new NativeDiv();
        ButtonDIV.add(this.addButton());
        let topDIV = new NativeDiv();
        topDIV.add(this.inputDIVs).add(ButtonDIV);
        this.DOM = topDIV.DOM;
        this.DOM.addEventListener("dblclick", (e) => {
            e.stopPropagation();
        });
    }
    addInputDIV(value = '') {
        let inputDIV = new NativeDiv();
        inputDIV.setStyle({ minWidth: '170px' });
        let input = new NaiveInput('', '请输入');
        input.setColor('black');
        input.DOM.addEventListener('input', () => {
            this.closure(this.getValue());
        });
        input.setStyle({ width: '140px', marginBottom: '2px', marginRight: '2px' });
        input.setValue(value);
        inputDIV.add(input).add(this.delButton(inputDIV.DOM));
        this.inputDIVs.add(inputDIV);
    }
    addButton() {
        // 添加input
        let add = new NativeButton('+');
        add.setStyle({ width: '20px', height: '20px' });
        add.DOM.addEventListener('click', () => {
            this.addInputDIV();
        });
        return add;
    }
    delButton(delDOM) {
        // 删除input
        let del = new NativeButton('-');
        del.setStyle({ width: '20px', height: '20px', minWidth: '20px' });
        del.DOM.addEventListener('click', () => {
            delDOM.remove();
            this.closure(this.getValue());
        });
        return del;
    }
    onChange(closure) {
        this.closure = closure;
        this.inputDIVs.DOM.childNodes.forEach((inputDIV) => {
            inputDIV.firstChild.addEventListener('input', () => {
                this.closure(this.getValue());
            });
            inputDIV.lastChild.addEventListener('click', () => {
                this.closure(this.getValue());
            });
        });
    }
    getValue() {
        let values = [];
        this.inputDIVs.DOM.childNodes.forEach((inputDIV) => {
            values.push(inputDIV.firstChild.value);
        });
        return values.join(',');
    }
    setValue(value) {
        this.inputDIVs.DOM.childNodes.forEach((inputDIV) => {
            this.inputDIVs.DOM.removeChild(inputDIV);
        });
        let valueArr = [];
        if (typeof value === 'string') {
            valueArr = value.split(',');
        }
        else if (typeof value === 'object') {
            valueArr = value;
        }
        valueArr.forEach((value) => {
            this.addInputDIV(String(value));
        });
    }
}
Object.defineProperty(ArrayWidget, "widgetType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'array'
});
export default ArrayWidget;
