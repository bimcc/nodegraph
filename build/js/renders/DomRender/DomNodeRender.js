var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NativeDiv, NativeSpan, } from "../../shared";
import { CustomEvetns, GraphAction, GraphEventTypes, NodeRenderEvents } from "../../types";
import { DomInputRender, DomOutputRender } from "../DomRender";
import { config } from '../../config';
import { Signals } from "../../event";
import { wait } from "../../Utils";
/**
 * @description 通过dom方式来渲染单个node的渲染器
 */
export class DomNodeRender {
    constructor(parentDom, node, viewPosition, events) {
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); //分配需要触发的事件
        Object.defineProperty(this, "renderEvents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Signals()
        }); //渲染器内部事件
        Object.defineProperty(this, "node", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "outputs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // node整体dom
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // 标题
        Object.defineProperty(this, "body", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // 内容部分
        Object.defineProperty(this, "subContent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        }); //子图内容
        Object.defineProperty(this, "inputsDom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputsDom", {
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
        }); // 最外层dom
        Object.defineProperty(this, "borderBox", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // 外围框
        Object.defineProperty(this, "dragSpan", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // 拖拽下标
        Object.defineProperty(this, "dragImg", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjkwNTExMDkwODUxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIyNzkiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik00NTEuMTA5IDk2MEgzNDhsNjEyLTYxMi0xLjY2MyAxMDMuMTA5TDQ1MS4xMDkgOTYweiBtMjY4LjQyNSAwSDYxNmwzNDQtMzQ0djEwMy41MzRMNzE5LjUzNCA5NjB6IiBmaWxsPSIjZjRlYTJhIiBwLWlkPSIyMjgwIj48L3BhdGg+PC9zdmc+'
        });
        Object.defineProperty(this, "viewPosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); //视图位置
        Object.defineProperty(this, "widgetsBox", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dragResize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "minWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "minHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.parentDom = parentDom;
        this.node = node;
        this.root = new NativeDiv();
        this.title = new NativeDiv();
        this.body = new NativeDiv();
        this.borderBox = new NativeDiv();
        this.dragSpan = new NativeSpan();
        this.inputsDom = new NativeDiv();
        this.outputsDom = new NativeDiv();
        this.events = events;
        this.viewPosition = viewPosition;
        this.widgetsBox = new NativeDiv();
        this.widgetsBox.setStyle({
            // 左右的border？
            width: "calc(100% - 4px)",
            display: "flex",
            flexDirection: "column"
        });
        this.dragSpan.setStyle({
            position: 'absolute',
            bottom: '1px',
            right: '1px',
            width: '20px',
            height: '20px',
            backgroundImage: `url('${this.dragImg}')`,
            backgroundPosition: '100% 100%',
            backgroundOrigin: 'content-box',
            backgroundRepeat: 'no-repeat',
            boxSizing: 'border-box',
            cursor: 'se-resize',
            zIndex: '100',
            pointerEvents: 'visible'
        });
        this._init();
        this._initEventListener();
        // 所有的新节点都应该在最上方
        this.setTopIndex();
    }
    _init() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { root, title, body, inputsDom, outputsDom } = this;
            const node = this.node;
            const titleHeight = 25;
            const slotsDom = new NativeDiv();
            root.setPosition('absolute', 0, 0)
                .setStyle({
                backgroundColor: (_a = this.node.options['nodeColor']) !== null && _a !== void 0 ? _a : config.style.NodeBackgroundColor,
                borderRadius: '8px',
                boxShadow: '2px 2px 7px 1px rgba(0, 0, 0, .2)',
                userSelect: 'none',
                webkitUserSelect: "none",
                cursor: "pointer",
                color: (_b = this.node.options['nodeFontColor']) !== null && _b !== void 0 ? _b : config.style.NodeFontColor,
            });
            // 节点拖拽宽高还原
            if (node.getOption('clientWidth')) {
                root.setWidth(node.getOption('clientWidth'), 'min');
            }
            if (node.getOption('clientHeight')) {
                root.setHeight(node.getOption('clientHeight'), 'min');
            }
            title.setWidth('100%');
            title.setHeight(titleHeight, 'min');
            title.setStyle({
                lineHeight: `${titleHeight}px`,
                textAlign: 'center',
                backgroundColor: (_c = this.node.options['nodeTitleColor']) !== null && _c !== void 0 ? _c : config.style.NodeTitleColor,
                borderRadius: '8px 8px 0px 0px',
                fontWeight: 'bold',
                padding: "4px 40px",
                boxSizing: "border-box",
                whiteSpace: "nowrap"
            });
            this.body.setStyle({
                height: "auto",
                padding: "4px",
                paddingBottom: "8px",
                minWidth: "120px",
                paddingTop: "10px"
            });
            title.innerText(node.label);
            this.borderBox.add(this.dragSpan);
            this.borderBox.setWidth('100%')
                .setHeight('100%')
                .setPosition('absolute', -4, -4)
                .setStyle({
                border: '2px solid ' + config.style.NodeHighLightColor,
                borderRadius: '9px',
                padding: '2px',
                pointerEvents: 'none'
            })
                .hide();
            slotsDom.setFlex();
            slotsDom.setJustifyContent('space-between');
            inputsDom.setStyle({
                flex: '1',
            });
            // @mark 输出节点通常没有widget，暂时无需grow
            // outputsDom.setStyle({
            //   flex: '1',
            // });
            body.setHeight(`calc( 100% - ${titleHeight}px )`);
            for (let output of node.outputs) {
                this.outputs.push(new DomOutputRender(this, outputsDom, output));
            }
            for (let input of node.inputs) {
                this.inputs.push(new DomInputRender(this, inputsDom, input));
            }
            slotsDom.add(inputsDom).add(outputsDom);
            this.body.add(slotsDom)
                .add(this.widgetsBox);
            this.root.add(this.title)
                .add(this.body)
                .add(this.borderBox);
            this.parentDom.add(this.root);
            this.setPosition(node.position.x, node.position.y);
            // this.adaption();
            const { width, height } = this.root.getBoundingClientRect();
            this.minWidth = width;
            this.minHeight = height;
            const slots = [...this.inputs, ...this.outputs];
            for (let slot of slots) {
                slot.onNodeInited();
            }
            yield wait(100);
            this.node.initedRender();
        });
    }
    setTopIndex() {
        config.zIndex = config.zIndex + 1;
        this.root.setStyle({
            zIndex: config.zIndex + ''
        });
    }
    _initEventListener() {
        this.renderEvents.create(NodeRenderEvents.Resize);
        this.renderEvents.create(NodeRenderEvents.Refresh);
        this.root.onMousedown((e) => {
            e.stopPropagation();
            this.events.dispatch(GraphEventTypes.NodeDown, e, this);
            // 凡点击时将本节点置于最上方
            this.setTopIndex();
            console.log(`点击了节点【${this.node.label}】【${this.node.id}】`);
        });
        let clickTimer = null;
        // 触发节点外部点击事件
        this.root.onClick((e) => {
            if (e.detail === 1) {
                clickTimer = setTimeout(() => {
                    this.events.dispatch(CustomEvetns.Node, e, this);
                }, 200);
            }
        });
        // 节点双击阻止点击事件触发
        this.root.onDblClick((e) => {
            clearTimeout(clickTimer);
        });
        this.root.onMouseover((e) => {
            this.events.dispatch(GraphEventTypes.NodeEnter, this);
        });
        this.root.onMouseout((e) => {
            this.events.dispatch(GraphEventTypes.NodeLeave, this);
        });
        this.dragSpan.onMousedown((e) => {
            e.stopPropagation();
            e.preventDefault();
            document.onmousemove = (emove) => {
                emove.stopPropagation();
                emove.preventDefault();
                const cx = emove.clientX;
                const cy = emove.clientY;
                const { x, y } = this.root.getBoundingClientRect();
                // @mark 鼠标离节点左上的绝对距离
                const width = (cx - x);
                const height = (cy - y);
                this.setSize(width, height);
                this.events.dispatch(GraphEventTypes.LinksFresh, this.node.graph.runedNodes);
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        });
    }
    /**
     * @description 设置node渲染宽高
     * @param w
     * @param h
     */
    setSize(w, h) {
        var _a, _b;
        const scale = this.events.getScale();
        let width = this.minWidth;
        let height = this.minHeight;
        if (w > this.minWidth * scale) {
            width = w / scale;
        }
        if (h > this.minHeight * scale) {
            height = h / scale;
        }
        if (width != this.minWidth || height != this.minHeight) {
            for (let inp of this.inputs) {
                inp.refresh();
            }
            for (let out of this.outputs) {
                out.refresh();
            }
            // 如果当前节点恰好是个子图
            if (this.node.subGraph) {
                const node = this.node;
                if (node.minSize && node.minSize.width * scale <= w) {
                    (_a = node.graphWidget) === null || _a === void 0 ? void 0 : _a.viewerDom.setWidth((node.originRect.width * scale + w - node.minSize.width * scale) / scale);
                }
                if (node.minSize && node.minSize.height * scale <= h) {
                    (_b = node.graphWidget) === null || _b === void 0 ? void 0 : _b.viewerDom.setHeight((node.originRect.height * scale + h - node.minSize.height * scale) / scale);
                }
            }
            this.renderEvents.dispatch(NodeRenderEvents.Resize, width * scale, height * scale);
        }
        this.root.setWidth(width, 'min').setHeight(height, 'min');
    }
    /**
     * @description 设置node渲染位置
     * @param x
     * @param y
     */
    setPosition(x, y) {
        // const pos = `translate( ${(x + this.viewPosition.x)/scale}px, ${(y + this.viewPosition.y)/scale}px)`;
        // this.root.setStyle({
        //   transform: pos,
        // });
        // @Mark 修改为外部transform
        const scale = this.events.getScale();
        this.root.setLeft(x).setTop(y);
    }
    /**
     * @description 自适应
     */
    adaption() {
        // todo 这个方法计算有问题
        const { root, title, body, inputs, outputs, } = this;
        const slotHeight = 17;
        const min = {
            w: 130,
            h: 80,
        };
        let width = title.getClientWidth();
        let height = title.getClientHeight();
        let iMaxWidth = 0; //输入最宽的一个的宽度
        for (let inp of inputs) {
            const w = inp.getWidth();
            if (iMaxWidth < w) {
                iMaxWidth = w;
            }
        }
        let oMaxWidth = 0; //输出最宽的一个的宽度
        for (let out of outputs) {
            const w = out.getWidth();
            if (oMaxWidth < w) {
                oMaxWidth = w;
            }
        }
        if (width < oMaxWidth + iMaxWidth) {
            width = oMaxWidth + iMaxWidth;
        }
        width = width > body.getClientWidth() ? width : body.getClientWidth();
        let slotNum = inputs.length > outputs.length ? inputs.length : outputs.length;
        height += slotNum * slotHeight;
        if (height < min.h) {
            height = min.h;
        }
        if (width < min.w) {
            width = min.w;
        }
        this.setSize(width, height);
    }
    /**
     * @description 获取输入渲染
     * @param index
     * @returns
     */
    getInput(index) {
        return this.inputs[index];
    }
    /**
     * @description 获取输出渲染
     * @param index
     * @returns
     */
    getOutput(index) {
        return this.outputs[index];
    }
    /**
     * @description 获取位置
     * @returns
     */
    getPosition() {
        return {
            x: this.node.position.x,
            y: this.node.position.y,
        };
    }
    /**
     * @description 刷新节点显示
     */
    refresh() {
        var _a;
        const { root, title, body, inputsDom, outputsDom } = this;
        this.setPosition(this.node.position.x, this.node.position.y);
        title.innerText(this.node.label);
        if (this.events.viewer.option.nodeIndexShow && DomNodeRender.showNodeIndex) {
            // @mark 给title加上左侧的index显示
            let indexBox = new NativeDiv();
            indexBox.innerText((_a = this.node.index.toString()) !== null && _a !== void 0 ? _a : "\\");
            // 添加index按钮，在title的左侧
            indexBox.setStyle({
                position: "absolute",
                left: "2px",
                top: "4px",
                height: "25px",
                lineHeight: "25px",
                textAlign: "center",
                minWidth: "25px",
                borderRadius: "50%",
                padding: "0 4px",
                backgroundColor: "black",
                color: "white",
                boxSizing: "border-box"
                // userSelect:"all",
                // webkitUserSelect:"all"
            });
            title.add(indexBox);
        }
        if (this.node.options['nodeColor'])
            root.setStyle({
                backgroundColor: this.node.options['nodeColor']
            });
        if (this.node.options['nodeTitleColor'])
            title.setStyle({
                backgroundColor: this.node.options['nodeTitleColor']
            });
        if (this.node.options['nodeFontColor'])
            root.setStyle({
                color: this.node.options['nodeFontColor']
            });
        const inputs = [];
        const outputs = [];
        //显示的比数据的多
        if (this.node.inputs.length < this.inputs.length) {
            const list = this.inputs.splice(this.node.inputs.length, this.inputs.length - this.node.inputs.length);
            for (let sr of list) {
                sr.remove();
            }
        }
        if (this.node.outputs.length < this.outputs.length) {
            const list = this.outputs.splice(this.node.outputs.length, this.outputs.length - this.node.outputs.length);
            for (let sr of list) {
                sr.remove();
            }
        }
        for (let slot of this.node.inputs) {
            const render = this.inputs[slot.index];
            //如果数据的比显示的少
            if (!render) {
                inputs.push(new DomInputRender(this, inputsDom, slot));
                continue;
            }
            if (render.slot !== slot) {
                //渲染的插槽不是数据的那个了
                const nr = new DomInputRender(this, inputsDom, slot);
                //如果有连线就替换掉
                if (slot.link && slot.link.info) {
                    slot.link.info.end = nr;
                    nr.linkInfo = slot.link.info;
                }
                nr.refresh();
                inputs.push(nr);
                render.remove();
            }
            else {
                render.refresh();
                inputs.push(render);
            }
        }
        for (let slot of this.node.outputs) {
            const render = this.outputs[slot.index];
            //如果数据的比显示的少
            if (!render) {
                outputs.push(new DomOutputRender(this, outputsDom, slot));
                continue;
            }
            if (render.slot !== slot) {
                //渲染的插槽不是数据的那个了
                const nr = new DomOutputRender(this, outputsDom, slot);
                //如果有连线就替换掉
                if (slot.link && slot.link.length > 0) {
                    for (let link of slot.link) {
                        if (!link.info)
                            continue;
                        link.info.start = nr;
                        nr.linkInfo = link.info;
                    }
                }
                nr.refresh();
                outputs.push(nr);
                render.remove();
            }
            else {
                render.refresh();
                outputs.push(render);
            }
        }
        this.inputs = inputs;
        this.outputs = outputs;
        this.widgetsBox.clear();
        for (let w of this.node.widgets) {
            // widget 绑定全局事件
            w.onMouseover((e) => {
                this.events.dispatch(GraphEventTypes.WidgetEnter, e, this, w);
            }, true);
            w.onMouseout((e) => {
                this.events.dispatch(GraphEventTypes.WidgetLeave, e, this, w);
            }, true);
            w.onMousedown((e) => {
                this.events.dispatch(GraphEventTypes.WidgetDown, e, this, w);
            }, true);
            // 触发widget外部点击事件
            if (w.isCustomClick) {
                w.onClick((e) => {
                    e.stopPropagation();
                    this.events.dispatch(CustomEvetns.Widget, e, this, w);
                }, true);
            }
            if (w.getLabel()) {
                let wBox = new NativeDiv();
                wBox.setFlex().setFlexDirection("row");
                wBox.setStyle({
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: "4px"
                });
                let label = new NativeSpan(w.getLabel());
                label.setStyle({
                    whiteSpace: "nowrap",
                    lineHeight: "100%",
                    fontSize: "14px",
                    marginRight: "4px"
                });
                w.setStyle({
                    flexGrow: "1"
                });
                wBox.add(label);
                wBox.add(w);
                wBox.setMarginBottom("6px");
                this.widgetsBox.add(wBox);
            }
            else {
                w.setMarginBottom("6px");
                this.widgetsBox.add(w);
            }
            this.renderEvents.dispatch(NodeRenderEvents.Refresh);
        }
        // 这个方法交给node自己处理自己与其他node不一样的dom操作
        if (this.node.onRefresh) {
            this.node.onRefresh();
        }
    }
    /**
     * @description 删除显示
     */
    remove() {
        this.root.remove();
    }
    /**
     * @description 获取右键菜单项内容
     */
    getContextMenu() {
        var _a, _b;
        const menu = this.node.getContextMenu();
        if (!this.node.subGraph && !this.node.options['notClone']) {
            menu.push({
                label: '克隆节点',
                callback: () => {
                    this.events.dispatch(GraphAction.CloneNode, this.node.id);
                }
            });
        }
        let addSlotFlag = false;
        if (this.node.options.addInput && this.node.addInputsConfig.length > 0) {
            const subMenu = [];
            for (let config of this.node.addInputsConfig) {
                subMenu.push({
                    label: (_a = config.label) !== null && _a !== void 0 ? _a : '未命名输入',
                    callback: () => {
                        this.events.dispatch(GraphAction.AddNodeInput, this, config);
                    }
                });
            }
            menu.push({
                label: '添加输入',
                subMenu,
            });
            addSlotFlag = true;
        }
        if (this.node.options.addOutput && this.node.addOutputsConfig.length > 0) {
            const subMenu = [];
            for (let config of this.node.addOutputsConfig) {
                subMenu.push({
                    label: (_b = config.label) !== null && _b !== void 0 ? _b : '未命名输出',
                    callback: () => {
                        this.events.dispatch(GraphAction.AddNodeOutput, this, config);
                    }
                });
            }
            menu.push({
                label: '添加输出',
                subMenu,
            });
            addSlotFlag = true;
        }
        if (addSlotFlag)
            menu.push(null);
        menu.push({
            label: '删除节点',
            callback: () => {
                this.events.dispatch(GraphAction.RemoveNode, this.node.id);
            }
        });
        return menu;
    }
    setHighLight(color = "") {
        this.node.onNodeHighLight();
        // console.log(this.getPosition())
        if (color) {
            this.borderBox.setStyle({
                borderColor: color
            });
        }
        this.borderBox.show();
        if (this.node.options['notResize']) {
            this.dragSpan.hide();
        }
        else {
            this.dragSpan.show();
        }
    }
    setLabel(value) {
        this.node.setLabel(value);
        this.refresh();
    }
    shake() {
        const shakeDuration = 500; // 震动的总时长（毫秒）
        const shakeMagnitude = 5; // 震动的幅度（像素）
        const startTime = Date.now();
        let currentTime = startTime;
        let shakeStep = () => {
            currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < shakeDuration) {
                const randomX = Math.random() * shakeMagnitude * 2 - shakeMagnitude;
                const randomY = Math.random() * shakeMagnitude * 2 - shakeMagnitude;
                this.root.DOM.style.transform = `translate(${randomX}px, ${randomY}px)`;
                requestAnimationFrame(shakeStep);
            }
            else {
                this.root.DOM.style.transform = 'none';
            }
        };
        shakeStep();
    }
    cancelHighLight() {
        this.borderBox.setStyle({
            borderColor: config.style.NodeHighLightColor
        });
        this.borderBox.hide();
    }
    /**
     * @description 获取渲染本身
     * @returns
     */
    getContent() {
        return this.root;
    }
    removeNode() {
        this.events.dispatch(GraphAction.RemoveNode, this.node.id);
    }
    setMinSize(size) {
        this.minWidth = size.width;
        this.minHeight = size.height;
    }
}
Object.defineProperty(DomNodeRender, "showNodeIndex", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: true
});
