var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventDataTypeStr, SlotTypes } from '../../core';
import { NativeDiv, } from "../../shared";
import { GraphAction, GraphEventTypes } from "../../types";
import { wait } from '../../Utils';
import { config } from "../../config";
import WidgetsManager from "../../shared/UI/widgets/WidgetsManager";
/**
 * @description dom渲染slot基类
 */
export class DomSlotRender {
    get isVerticalMode() {
        return !!this.slot.options['isVertical'];
    }
    constructor(parent, parentDom, slot) {
        Object.defineProperty(this, "parent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "slot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "parentDom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "horizontal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                root: new NativeDiv(),
                pin: new NativeDiv(),
                label: new NativeDiv(),
                pinLinked: new NativeDiv(), //连接状态的div
            }
        }); //水平状态的连接点
        Object.defineProperty(this, "vertical", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                root: new NativeDiv(),
                pin: new NativeDiv(),
                label: new NativeDiv(),
                pinLinked: new NativeDiv(), //连接状态的div
            }
        }); //垂直
        Object.defineProperty(this, "linkInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "slotSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 10
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.parent = parent;
        this.slot = slot;
        this.parentDom = parentDom;
        this.events = parent.events;
        this._initHorizontal();
        this._initVertical();
        this.setVerticalMode(this.isVerticalMode);
    }
    _initHorizontal() {
        const { pin, label, root, pinLinked } = this.horizontal;
        const slot = this.slot;
        this.createPin(pin, pinLinked);
        label.setMarginLeft('5px');
        label.setMarginRight('5px');
        label.setFontSize(13);
        label.setStyle({
            whiteSpace: 'nowrap',
        });
        label.add(`${slot.getLabel()}`);
        root.setFlex();
        root.setStyle({
            alignItems: 'center',
            marginBottom: "6px"
        });
        if (slot.type === SlotTypes.INPUT) {
            root.add(pin);
            root.add(label);
            root.setJustifyContent('flex-start');
        }
        else {
            root.add(label);
            root.add(pin);
            root.setJustifyContent('flex-end');
        }
        if (slot.allow_input) {
            let input = WidgetsManager.createWidget(slot.inputWidgetType);
            if (input) {
                input.setWidth(50, 'min');
                input.setValue(slot.value);
                input.onChange((v) => {
                    slot.value = v;
                });
                root.add(input);
            }
        }
        this.parentDom.add(root);
        // @mark pin 和 label 均可触发连线事件
        // 只有由pin开始
        // 这个写法是整个div都可以连线
        // root.onMousedown((e: MouseEvent) => {
        //   e.stopPropagation();
        //   this.events.dispatch(GraphEventTypes.SlotDown, e, this.parent, this)
        // });
        [pin, label].forEach((item) => {
            // 只要 pin 和label，inputs和outputs中间的位置留做点击事件
            item.onMousedown((e) => {
                e.stopPropagation();
                this.events.dispatch(GraphEventTypes.SlotDown, e, this.parent, this);
            });
            item.onMouseover((e) => {
                e.stopPropagation();
                this.events.dispatch(GraphEventTypes.SlotEnter, this);
            });
            item.onMouseout((e) => {
                e.stopPropagation();
                this.events.dispatch(GraphEventTypes.SlotLeave, this);
            });
        });
    }
    _initVertical() {
        const { pin, label, root, pinLinked } = this.vertical;
        const slot = this.slot;
        this.createPin(pin, pinLinked);
        label.setFontSize(13);
        label.setStyle({
            whiteSpace: 'nowrap',
        });
        label.add(`${slot.getLabel()}`);
        pin.setMarginLeft('0px')
            .setMarginRight('0px');
        if (this.slot.type === SlotTypes.OUTPUT) {
            pin.setBackgroundColor('rgb(54, 54, 54)');
        }
        root.setAbsolute();
        root.add(pin);
        root.add(label);
        this.parentDom.add(root);
        root.setStyle({
            marginBottom: "6px"
        });
        root.onMousedown((e) => {
            e.stopPropagation();
            this.events.dispatch(GraphEventTypes.SlotDown, e, this.parent, this);
        });
        [pin, label].forEach((item) => {
            item.onMouseover((e) => {
                e.stopPropagation();
                this.events.dispatch(GraphEventTypes.SlotEnter, this);
            });
            item.onMouseout((e) => {
                e.stopPropagation();
                this.events.dispatch(GraphEventTypes.SlotLeave, this);
            });
        });
    }
    /**
     * @description 刷新垂直插槽位置
     */
    refreshVerticalPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            yield wait(0);
            const { pin, label, root, pinLinked } = this.vertical;
            // const position = this.slot.node.position;
            const width = this.parent.getContent().getClientWidth();
            const height = this.parent.getContent().getClientHeight();
            const slot = this.slot;
            let top = 0;
            let left = 0;
            let totalVSlotNum = 0;
            let totalNotVSlotNum = 0;
            label.setAbsolute()
                .setLeft(-label.getClientWidth() / 2 + this.slotSize / 2);
            if (slot.type === SlotTypes.INPUT) {
                top = -this.slotSize / 2;
                for (let input of slot.node.inputs) {
                    if (input === slot)
                        continue;
                    if (input.options['isVertical']) {
                        totalVSlotNum += 1;
                    }
                    else {
                        if (input.index < slot.index)
                            totalNotVSlotNum += 1;
                    }
                }
                label.setTop(-17);
            }
            else {
                top = height - (this.slotSize / 2);
                for (let output of slot.node.outputs) {
                    if (output === slot)
                        continue;
                    if (output.options['isVertical']) {
                        totalVSlotNum += 1;
                    }
                    else {
                        if (output.index < slot.index)
                            totalNotVSlotNum += 1;
                    }
                }
                label.setTop(13);
            }
            left = ((width / (totalVSlotNum + 2)) * (slot.index + 1 - totalNotVSlotNum)) - (this.slotSize / 2);
            root.setTop(top).setLeft(left);
        });
    }
    /**
     * @description 创建连接点传入dom就直接在dom上设置样式 不传入就创建一个
     * @param pin
     * @param pinLinked
     */
    createPin(pin = null, pinLinked = null) {
        if (!pin)
            pin = new NativeDiv();
        if (!pinLinked)
            pinLinked = new NativeDiv();
        pinLinked.setWidth(this.slotSize - 2, 'min');
        pinLinked.setHeight(this.slotSize - 2, 'min');
        pinLinked.setMarginTop('1px');
        pinLinked.setMarginLeft('1px');
        // @mark 对触发顺序的slot的特殊处理
        if (this.slot.valueType == EventDataTypeStr || (Array.isArray(this.slot.valueType) && this.slot.valueType.indexOf(EventDataTypeStr) > -1)) {
            // 这是一个触发顺序slot
            pinLinked.setBackgroundColor(config.style.NodeHighLightColor);
        }
        else {
            pinLinked.setBackgroundColor(config.style.LineRunningColor);
            pinLinked.setStyle({
                borderRadius: '50%',
            });
            pin.setStyle({
                borderRadius: '50%',
            });
        }
        pinLinked.hide();
        pin.setWidth(this.slotSize, 'min');
        pin.setHeight(this.slotSize, 'min');
        pin.setMarginLeft('5px');
        pin.setMarginRight('5px');
        pin.setStyle({
            backgroundColor: '#767676',
            border: '1px solid rgb(36 36 36)',
        });
        pin.add(pinLinked);
        return { pin, pinLinked };
    }
    /**
     * @description 当节点内容渲染完成后
     */
    onNodeInited() {
        this.refreshVerticalPosition();
    }
    /**
     * @description 设置垂直模式显示
     */
    setVerticalMode(value) {
        this.slot.options['isVertical'] = value;
        if (value) {
            this.horizontal.root.hide();
            this.refreshVerticalPosition();
        }
        else {
            this.vertical.root.hide();
        }
    }
    /**
     * @description 获取宽度
     * @returns
     */
    getWidth() {
        if (this.isVerticalMode)
            return 0;
        return this.horizontal.root.getClientWidth();
    }
    /**
     * @description 设置连接状态样式
     * @param value
     */
    setLinked(value) {
        if (value) {
            this.horizontal.pinLinked.show();
            this.vertical.pinLinked.show();
        }
        else {
            this.horizontal.pinLinked.hide();
            this.vertical.pinLinked.hide();
        }
    }
    /**
     * @description 根据数据刷新显示
     */
    refresh() {
        const { label } = this.horizontal;
        const { slot } = this;
        if (slot.type === SlotTypes.INPUT) {
            this.setLinked(!!slot.link);
        }
        else {
            this.setLinked(slot.link.length > 0);
        }
        const labelText = `${slot.getLabel()}`;
        if (label.getInnerText() !== labelText) {
            label.clear();
            label.add(labelText);
        }
        this.refreshVerticalPosition();
    }
    /**
     * @description 获取插槽位置
     */
    getPosition() {
        const pos = this.parent.getPosition();
        if (!this.isVerticalMode) {
            return {
                x: pos.x + this.horizontal.pin.getOffsetLeft() + (this.slotSize / 2),
                y: pos.y + this.horizontal.pin.getOffsetTop() + (this.slotSize / 2),
            };
        }
        else {
            return {
                x: pos.x + this.vertical.root.getOffsetLeft() + (this.slotSize / 2),
                y: pos.y + this.vertical.root.getOffsetTop() + (this.slotSize / 2),
            };
        }
    }
    /**
     * @description 获取右键菜单项内容
     */
    getContextMenu() {
        const menu = [];
        if (this.slot.options['remove']) {
            menu.push({
                label: '删除插槽',
                callback: () => {
                    if (this.slot.options['removeFunc']) {
                        this.slot.options['removeFunc'](this.slot);
                    }
                    this.events.dispatch(GraphAction.RemoveNodeSlot, this);
                }
            });
        }
        // if(this.slot.options['rename']){
        //   menu.push({
        //     label : '重命名插槽',
        //     callback:()=>{
        //     }
        //   });
        // }
        return menu;
    }
    /**
     * @description 销毁
     */
    remove() {
        this.horizontal.root.remove();
        this.vertical.root.remove();
    }
}
