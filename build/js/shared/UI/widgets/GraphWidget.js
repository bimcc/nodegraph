/*
 * @Date: 2023-08-07 16:17:24
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-09-21 17:50:07
 * @FilePath: /graph/src/shared/UI/widgets/GraphWidget.ts
 */
import { Graph } from "../../../core";
import { GraphViewer } from "../../../viewer";
import Alert from "../Alert";
import { NativeDiv } from "../NativeDiv";
import BaseWidget from "./BaseWidget";
export var GraphWidgetModes;
(function (GraphWidgetModes) {
    GraphWidgetModes[GraphWidgetModes["min"] = 0] = "min";
    GraphWidgetModes[GraphWidgetModes["window"] = 1] = "window";
})(GraphWidgetModes || (GraphWidgetModes = {}));
class GraphWidget extends BaseWidget {
    constructor(option) {
        var _a;
        super();
        Object.defineProperty(this, "graph", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "viewer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "viewerDom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "minDom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); //最小化模式
        Object.defineProperty(this, "mode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: GraphWidgetModes.window
        });
        Object.defineProperty(this, "minSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                w: 400,
                h: 300,
            }
        });
        Object.defineProperty(this, "size", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                w: this.minSize.w,
                h: this.minSize.h,
            }
        });
        const viewerDom = this.viewerDom = new NativeDiv();
        const minViewerBtn = new NativeDiv();
        viewerDom.setStyle({
            position: "relative",
            top: "0px",
            left: "0px",
        });
        minViewerBtn.setStyle({
            position: 'absolute',
            top: "10px",
            left: "10px",
            width: '26px',
            height: '26px',
            backgroundColor: 'rgb(26 26 26)',
            borderRadius: '5px',
            textAlign: 'center',
            lineHeight: '23px',
            cursor: 'pointer',
            color: "white"
        }).innerText('-');
        minViewerBtn.onClick(() => {
            this.setMode(GraphWidgetModes.min);
        });
        // 展开子图按钮
        const minDom = this.minDom = new NativeDiv();
        // 阻止右键
        minDom.onContextmenu((e) => {
            e.preventDefault();
        });
        const minBtn = new NativeDiv();
        minDom.setStyle({
            width: '120px',
            height: '30px',
            // padding: '3px',
        });
        minBtn.setStyle({
            width: '100%',
            height: '100%',
            backgroundColor: '#6FA1FF',
            borderRadius: '6px',
            textAlign: 'center',
            lineHeight: '30px',
        });
        minBtn.innerText('展开子图');
        minBtn.onMouseout(() => {
            minBtn.setBackgroundColor('#6FA1FF');
        });
        minBtn.onMouseover(() => {
            minBtn.setBackgroundColor('#409eff');
        });
        minBtn.onClick(() => {
            this.setMode(GraphWidgetModes.window);
        });
        minDom.add(minBtn);
        this.add(minDom);
        this.add(viewerDom);
        this.graph = (_a = option.graph) !== null && _a !== void 0 ? _a : new Graph();
        this.viewer = new GraphViewer(viewerDom.DOM, this.graph);
        viewerDom.add(minViewerBtn);
        this.initEventListener();
        this.setMode(this.mode);
    }
    initEventListener() {
        this.onMousedown((e) => {
            e.stopPropagation();
        });
        this.onMouseup((e) => {
            // e.stopPropagation();
        });
        this.onMousemove((e) => {
            // e.stopPropagation();
        });
        this.onWheel((e) => {
            e.stopPropagation();
        });
        this.onContextmenu((e) => {
            e.stopPropagation();
        });
    }
    setMode(mode) {
        var _a, _b, _c, _d;
        this.mode = mode;
        switch (mode) {
            case GraphWidgetModes.min:
                if (this.viewerDom.DOM.style.position == "absolute") {
                    Alert.warning("子图正处于放大状态，请先退出子图");
                    return;
                }
                (_b = (_a = this.graph.parentNode) === null || _a === void 0 ? void 0 : _a.render) === null || _b === void 0 ? void 0 : _b.widgetsBox.setAlignItems("center");
                this.viewerDom.hide();
                this.minDom.show();
                break;
            case GraphWidgetModes.window:
                (_d = (_c = this.graph.parentNode) === null || _c === void 0 ? void 0 : _c.render) === null || _d === void 0 ? void 0 : _d.widgetsBox.setAlignItems("inherit");
                this.viewerDom.show();
                this.minDom.hide();
                break;
        }
        this.refreshSize();
        this.onChangeMode(mode);
    }
    refreshSize() {
        switch (this.mode) {
            case GraphWidgetModes.min:
                this.setWidth(this.minDom.getClientWidth());
                this.setHeight(this.minDom.getClientHeight());
                break;
            case GraphWidgetModes.window:
                this.viewerDom.setWidth(this.size.w).setHeight(this.size.h);
                this.setWidth(this.size.w).setHeight(this.size.h);
                break;
        }
    }
    onChange(closure) {
    }
    getValue() {
    }
    setValue(value) {
    }
    onChangeMode(v) {
    }
    setGraph(g) {
        this.graph = g;
        this.viewer.graph = g;
        this.viewer.tools.control.graph = g;
    }
    refresh(...arg) {
        this.viewer.refresh(...arg);
    }
    changeSize(offset) {
        this.size.w += offset.w;
        this.size.h += offset.h;
        this.refreshSize();
    }
}
Object.defineProperty(GraphWidget, "widgetType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'graph'
});
export default GraphWidget;
