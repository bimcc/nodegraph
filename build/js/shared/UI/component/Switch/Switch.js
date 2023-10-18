/*
 * @Author: zw1995
 * @Description: Switch 开关
 * @Date: 2023-07-31 10:08:38
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-08-07 10:19:22
 */
import { DomBase } from "../../Base";
import { NaiveInput } from "../../NativeInput";
import { NativeSpan } from "../../NativeSpan";
export class Switch extends DomBase {
    constructor(prop) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
        Object.defineProperty(this, "activeText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inactiveText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "activeValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inactiveValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "activeColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inactiveColor", {
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
        Object.defineProperty(this, "activeSpan", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inactiveSpan", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "coreSpan", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "switchSpan", {
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
        this.addClass('switch').setStyle({
            whiteSpace: 'nowrap',
            textAlign: 'right'
        });
        this.value = (_a = prop === null || prop === void 0 ? void 0 : prop.value) !== null && _a !== void 0 ? _a : false;
        this.activeText = (_b = prop === null || prop === void 0 ? void 0 : prop.activeText) !== null && _b !== void 0 ? _b : '';
        this.inactiveText = (_c = prop === null || prop === void 0 ? void 0 : prop.inactiveText) !== null && _c !== void 0 ? _c : '';
        this.activeValue = (_d = prop === null || prop === void 0 ? void 0 : prop.activeValue) !== null && _d !== void 0 ? _d : true;
        this.inactiveValue = (_e = prop === null || prop === void 0 ? void 0 : prop.inactiveValue) !== null && _e !== void 0 ? _e : false;
        this.activeColor = (_f = prop === null || prop === void 0 ? void 0 : prop.activeColor) !== null && _f !== void 0 ? _f : '#409EFF';
        this.inactiveColor = (_g = prop === null || prop === void 0 ? void 0 : prop.inactiveColor) !== null && _g !== void 0 ? _g : '#C0CCDA';
        this.disabled = (_h = prop === null || prop === void 0 ? void 0 : prop.disabled) !== null && _h !== void 0 ? _h : false;
        this.input = new NaiveInput('', '请选择');
        this.input.DOM.setAttribute('type', 'hidden');
        this.inactiveSpan = new NativeSpan();
        this.activeSpan = new NativeSpan();
        this.coreSpan = new NativeSpan();
        this.switchSpan = new NativeSpan();
        this.onChangeCallback = (_j = prop === null || prop === void 0 ? void 0 : prop.onChangeCallback) !== null && _j !== void 0 ? _j : null;
        this.add(this.input);
        this.initSwitchDom();
    }
    initSwitchDom() {
        if (this.inactiveText) {
            this.inactiveSpan.innerText(this.inactiveText);
            this.inactiveSpan.setStyle({
                marginRight: '10px',
                height: '20px',
                display: 'inline-block',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                verticalAlign: 'middle',
                color: this.inactiveColor,
                lineHeight: '20px'
            });
            this.add(this.inactiveSpan);
        }
        this.coreSpan.setStyle({
            position: 'absolute',
            top: '2px',
            display: 'block',
            borderRadius: '100%',
            width: '16px',
            height: '16px',
            backgroundColor: '#FFFFFF'
        });
        let bgColor = this.value ? this.activeColor : this.inactiveColor;
        this.switchSpan.setStyle({
            position: 'relative',
            width: '40px',
            backgroundColor: bgColor,
            display: 'inline-block',
            height: '20px',
            borderRadius: '10px',
            boxSizing: 'border-box',
            cursor: 'pointer',
            transition: 'border-color .3s,background-color .3s',
            verticalAlign: 'middle',
        });
        this.switchSpan.add(this.coreSpan);
        if (this.value) {
            this.coreSpan.setRight(3);
        }
        else {
            this.coreSpan.setLeft(3);
        }
        this.add(this.switchSpan);
        this.switchSpan.onMousedown((e) => {
            e.stopPropagation();
            this.value = !this.value;
            if (this.value) {
                this.coreSpan.setLeft('');
                this.coreSpan.setRight(3);
                this.switchSpan.setBackgroundColor(this.activeColor);
                this.activeSpan.setColor(this.activeColor);
                this.inactiveSpan.setColor(this.inactiveColor);
            }
            else {
                this.coreSpan.setLeft(3);
                this.coreSpan.setRight('');
                this.switchSpan.setBackgroundColor(this.inactiveColor);
                this.activeSpan.setColor(this.inactiveColor);
                this.inactiveSpan.setColor(this.activeColor);
            }
            // onChange
            this.onChangeCallback && this.onChangeCallback(this.value);
        });
        if (this.activeText) {
            this.activeSpan.innerText(this.activeText);
            this.activeSpan.setStyle({
                marginLeft: '10px',
                height: '20px',
                display: 'inline-block',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                verticalAlign: 'middle',
                color: this.activeColor,
                lineHeight: '20px'
            });
            this.add(this.activeSpan);
        }
    }
    onChange(callback) {
        this.onChangeCallback = callback;
        return this;
    }
    setValue(value) {
        if (value === this.value)
            return;
        this.value = value;
        if (this.value) {
            this.coreSpan.setLeft('');
            this.coreSpan.setRight(3);
            this.switchSpan.setBackgroundColor(this.activeColor);
            this.activeSpan.setColor(this.activeColor);
            this.inactiveSpan.setColor(this.inactiveColor);
        }
        else {
            this.coreSpan.setLeft(3);
            this.coreSpan.setRight('');
            this.switchSpan.setBackgroundColor(this.inactiveColor);
            this.activeSpan.setColor(this.inactiveColor);
            this.inactiveSpan.setColor(this.activeColor);
        }
    }
}
