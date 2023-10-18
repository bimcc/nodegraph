import { NativeDiv } from "../NativeDiv";
import { NaiveInput } from "../NativeInput";
export class NodePanelInput {
    constructor(parent) {
        Object.defineProperty(this, "parent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "label", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "input", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isReadOnly", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "styles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                fontColor: '#ffffff',
                backColor: '#4b4b4b',
            }
        });
        this.parent = parent;
        this.root = new NativeDiv();
        this.label = new NativeDiv();
        this.input = new NaiveInput('', '请输入');
        this.init();
    }
    setReadOnly(isReadOnly) {
        const { input } = this;
        if (!isReadOnly) {
            input.removeAttribute('readonly');
            input.setStyle({
                backgroundColor: '#a8a8a8',
            });
        }
        else {
            input.setAttribute('readonly', 'readonly');
            input.setStyle({
                backgroundColor: this.styles.backColor,
                fontSize: '17px',
            });
        }
        this.isReadOnly = isReadOnly;
    }
    setValue(value, label) {
        this.input.setValue(value);
        if (label) {
            this.label.innerText(label);
        }
    }
    onChange(onChange) {
        this.input.onChange(() => {
            onChange(this.input.getValue());
        });
    }
    init() {
        const { root, label, input } = this;
        root.setStyle({
            display: 'flex',
            width: 'calc( 100% - 20px)',
            height: '30px',
            margin: '5px 10px 0px 10px',
            color: this.styles.fontColor,
            backgroundColor: this.styles.backColor,
        });
        label.setStyle({
            width: '100px',
            lineHeight: '30px',
        });
        label.innerText('测试');
        input.setStyle({
            lineHeight: '30px',
            backgroundColor: '#a8a8a8',
            color: this.styles.fontColor,
            borderRadius: '2px',
            fontSize: "16px"
        });
        root.add(label);
        root.add(input);
        this.parent.add(root);
    }
    refresh() {
        const { root, label, input } = this;
        root.setStyle({
            color: this.styles.fontColor,
            backgroundColor: this.styles.backColor,
        });
        input.setStyle({
            color: this.styles.fontColor,
        });
        this.setReadOnly(this.isReadOnly);
    }
    remove() {
        this.root.remove();
    }
}
