/*
 * @Author: zw1995
 * @Description:
 * @Date: 2023-07-28 16:08:38
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-08-25 18:26:57
 */
import { DomBase } from "../../Base";
import { Option } from "./Option";
import { SelectDropdown } from "./SelectDropdown";
import { NaiveInput } from "../../NativeInput";
export class Select extends DomBase {
    constructor(prop) {
        var _a, _b, _c, _d;
        super();
        Object.defineProperty(this, "input", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "multiple", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "disabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dropdown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "activeOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "onChangeCallback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.addClass('select').setStyle({
            position: 'relative',
            padding: '0 3px'
        });
        this.multiple = (_a = prop === null || prop === void 0 ? void 0 : prop.multiple) !== null && _a !== void 0 ? _a : false;
        this.disabled = (_b = prop === null || prop === void 0 ? void 0 : prop.disabled) !== null && _b !== void 0 ? _b : false;
        this.value = (prop === null || prop === void 0 ? void 0 : prop.value) && !Array.isArray(prop.value) ? [prop.value] : [];
        this.options = (_c = prop === null || prop === void 0 ? void 0 : prop.options) !== null && _c !== void 0 ? _c : [];
        this.activeOptions = [];
        this.onChangeCallback = (_d = prop === null || prop === void 0 ? void 0 : prop.onChangeCallback) !== null && _d !== void 0 ? _d : null;
        this.input = new NaiveInput('', '请选择');
        this.input.DOM.style.cursor = 'pointer';
        this.input.setColor("black");
        this.input.onClick((e) => {
            e.preventDefault();
            this.dropdown.toggle();
            // @mark selectDropdown中设置了 index = 1即可遮住其他
            // GraphViewer.zIndex = GraphViewer.zIndex + 1
            // this.dropdown.setStyle({
            //   zIndex: GraphViewer.zIndex + ''
            // })
        });
        this.add(this.input);
        // const arr = this.getLabel() as Array<string | number>;
        // this.input.setValue(arr.join());
        // Dropdown
        this.dropdown = new SelectDropdown(`${this.input.DOM.clientHeight + 25}px`);
        // this.dropdown.hide();
        // this.options.forEach((item) => {
        //   const option = new Option(this, item);
        //   this.dropdown.add(option);
        //   if (this.hasValue(item.value)) {
        //     this.activeOptions.push(option);
        //     option.active();
        //   }
        // });
        this.add(this.dropdown);
        this.setValue(this.value);
        // Event
        // this.input.onClick((e: MouseEvent) => {
        //   e.stopPropagation();
        //   this.dropdown.toggle();
        // });
    }
    setValue(value) {
        this.value = value;
        const arr = this.getLabel();
        this.input.setValue(arr.join());
        // Dropdown
        this.dropdown.hide();
        // @mark 重建options的时候要先清空
        this.dropdown.clear();
        this.options.forEach((item) => {
            const option = new Option(this, item);
            this.dropdown.add(option);
            if (this.hasValue(item.value)) {
                this.activeOptions.push(option);
                option.active();
            }
        });
        // onChange
        this.onChangeCallback && this.onChangeCallback(this.value);
    }
    /**
     * @description: 注册数据变化时的回调
     * @param {function} callback
     * @return {*}
     */
    onChange(callback) {
        this.onChangeCallback = callback;
        return this;
    }
    /**
     * @description: 新增一个选项
     * @param {Option} option 选项实例
     * @return {this}
     */
    addOption(option) {
        this.dropdown.add(option);
        return this;
    }
    /**
     * @description: 选中
     * @param {Option} option 选项实例
     * @return {this}
     */
    checked(option) {
        if (this.multiple) {
            const index = this.activeOptions.indexOf(option);
            if (index > -1) {
                this.activeOptions[index].active(false);
                this.activeOptions.splice(index, 1);
                const valueIndex = this.value.indexOf(option.value);
                this.value.splice(valueIndex, 1);
            }
            else {
                this.activeOptions.push(option);
                option.active();
                this.value.push(option.value);
            }
        }
        else {
            if (this.activeOptions.length) {
                this.activeOptions[0].active(false);
            }
            this.activeOptions[0] = option;
            option.active();
            this.value[0] = option.value;
            this.dropdown.toggle();
        }
        const arr = this.getLabel();
        this.input.setValue(arr.join());
        // onChange
        this.onChangeCallback && this.onChangeCallback(this.value);
    }
    /**
     * @description: 获取选中项的显示值
     * @param {string} value
     * @return {*}
     */
    getLabel(value) {
        var _a;
        if (value === undefined) {
            const arr = [];
            this.options.forEach((item) => {
                this.hasValue(item.value) && arr.push(item.label);
            });
            return arr;
        }
        else {
            let one = this.options.find((item) => item.value === value);
            return (_a = one === null || one === void 0 ? void 0 : one.label) !== null && _a !== void 0 ? _a : '';
        }
    }
    /**
     * @description: 获取值
     * @return {*}
     */
    getValue() {
        return this.multiple ? this.value : this.value[0];
    }
    /**
     * @description: 判断某个值是否为已选中
     * @param {string} value
     * @return {*}
     */
    hasValue(value) {
        return this.value.indexOf(value) > -1;
    }
}
