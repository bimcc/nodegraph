var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NativeButton, NativeDiv } from '../../../../shared';
import Alert from '../../../../shared/UI/Alert';
import { GraphWidgetModes } from '../../../../shared/UI/widgets/GraphWidget';
import { GraphEventTypes } from '../../../../types';
import { Graph, Node, } from "../../../graph";
/**
 * @description 子图
 */
export class NSubGraph extends Node {
    get subViewer() {
        if (!this.graphWidget)
            return null;
        if (!this.graphWidget.viewer)
            return null;
        return this.graphWidget.viewer;
    }
    constructor() {
        super();
        Object.defineProperty(this, "graphWidget", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "minSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "originRect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "exitFunc", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // 是否正在放大状态？
        Object.defineProperty(this, "isMaxmized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "addInputsConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [{
                    label: '输入项',
                    options: {
                        remove: true,
                    },
                    valueType: ['any'],
                }]
        });
        Object.defineProperty(this, "addOutputsConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [{
                    label: '输出项',
                    options: {
                        remove: true,
                    },
                    valueType: 'any',
                }]
        });
        // @mark 子图依然使用label进行渲染标题
        // this.setProperty('SubGraphName', '新的子图');
        this.subGraph = new Graph();
        this.subGraph.parentNode = this;
        this.setOption('addInput', true);
        this.setOption('addOutput', true);
        this.graphWidget = this.addWidget('graph', { graph: this.subGraph });
        this.graphWidget.onChangeMode = (mode) => {
            if (!this.graphWidget)
                return;
            if (mode === GraphWidgetModes.min) {
                setTimeout(() => {
                    var _a;
                    (_a = this.render) === null || _a === void 0 ? void 0 : _a.setSize(this.graphWidget.minDom.getClientWidth(), this.graphWidget.minDom.getClientHeight());
                }, 0);
            }
        };
        this.graphWidget.viewer.events.add(GraphEventTypes.MouseUp, () => __awaiter(this, void 0, void 0, function* () {
            // if(!this.viewer || !this.graphWidget) return;
            // const subViewer = this.graphWidget.viewer as GraphViewer;
            // const subUIMan = subViewer.getRenderByTarget(RenderTargetTypes.UI) as IUIManager;
            // if(!subUIMan.isShowContextMenu) return;
            // await wait(0);
            // this.viewer.events.dispatch(GraphEventTypes.CloseContextMenu);
        }));
    }
    refreshViewer() {
        var _a;
        (_a = this.graphWidget) === null || _a === void 0 ? void 0 : _a.refresh(true);
    }
    setSubGraph(v) {
        super.setSubGraph(v);
        if (this.graphWidget && v) {
            this.graphWidget.setGraph(v);
        }
    }
    initedRender() {
        var _a;
        const render = this.render;
        if (!render)
            return;
        this.minSize = render.getContent().getBoundingClientRect();
        this.originRect = (_a = this.graphWidget) === null || _a === void 0 ? void 0 : _a.viewerDom.getBoundingClientRect();
        // @detail @mark 在上级窗口变化大小时直接退出全屏模式，避免出现漏出上级画布
        // 无需递归寻找顶级，自然会全部缩小
        render.events.add(GraphEventTypes.ViewResize, () => {
            if (this.exitFunc) {
                this.exitFunc();
            }
        });
    }
    // override getLabel() {
    //   return this.getProperty('SubGraphName')
    // }
    onNodeHighLight() {
        if (!this.graphWidget)
            return;
        switch (this.graphWidget.mode) {
            case GraphWidgetModes.min:
                this.setOption('notResize', true);
                break;
            case GraphWidgetModes.window:
                this.setOption('notResize', false);
                break;
        }
    }
    onRefresh() {
        const render = this.render;
        if (!render)
            return;
        // 添加最大化按钮，在title的右侧
        let maxButton = new NativeDiv();
        maxButton.innerText("+");
        maxButton.setStyle({
            position: "absolute",
            right: "6px",
            top: "4px",
            height: "25px",
            lineHeight: "25px",
            textAlign: "center",
            width: "25px",
            borderRadius: "50%",
            backgroundColor: "black",
            color: "white"
        });
        maxButton.onClick(() => {
            this.maxmizeViewer();
        });
        render.title.add(maxButton);
    }
    getName() {
        var _a;
        if ((_a = this.graph) === null || _a === void 0 ? void 0 : _a.parentNode) {
            const node = this.graph.parentNode;
            return node.getName() + " => " + this.label;
        }
        return this.label;
    }
    maxmizeViewer() {
        var _a, _b, _c, _d, _e, _f, _g;
        if (((_a = this.graphWidget) === null || _a === void 0 ? void 0 : _a.mode) == GraphWidgetModes.min) {
            Alert.warning("子图收缩中，无法放大");
            return;
        }
        // 长宽一定是上级viewerDom的实际长宽
        const render = this.render;
        const nowViewer = (_b = this.graphWidget) === null || _b === void 0 ? void 0 : _b.viewer;
        const parentViewer = render.events.viewer;
        const parentViewerDomRect = parentViewer === null || parentViewer === void 0 ? void 0 : parentViewer.rootDom.getBoundingClientRect();
        // todo 子图套子图时的回归缩放处理
        const originStyle = {
            position: nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.rootDom.DOM.style.position,
            zIndex: nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.rootDom.DOM.style.zIndex,
            left: nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.rootDom.DOM.style.left,
            top: nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.rootDom.DOM.style.top,
            width: nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.rootDom.DOM.style.width,
            height: nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.rootDom.DOM.style.height,
            // transition:nowViewer?.rootDom.DOM.style.transition
        };
        const originViewPosition = nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.events.viewPosition;
        // const offsetScale = render.events.getParentScale();
        const scale = render.events.getScale();
        // this.
        nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.rootDom.setAbsolute(-render.events.viewPosition.y - this.position.y, -render.events.viewPosition.x - this.position.x, 99999).setWidth(parentViewerDomRect.width).setHeight(parentViewerDomRect.height).setStyle({
            transition: "all .5s ease"
        });
        // 关闭父级的control 和minimap
        (_c = parentViewer === null || parentViewer === void 0 ? void 0 : parentViewer.tools.miniMap) === null || _c === void 0 ? void 0 : _c.hide();
        (_d = parentViewer === null || parentViewer === void 0 ? void 0 : parentViewer.tools.control) === null || _d === void 0 ? void 0 : _d.hide();
        let button = new NativeButton("退出子图");
        button.setStyle({
            zIndex: "123123",
            marginLeft: "10px"
        });
        button.onClick(() => {
            exit();
        });
        // 当前viewer的UI处理
        (_e = nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.tools.control) === null || _e === void 0 ? void 0 : _e.add(button);
        (_f = nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.tools.miniMap) === null || _f === void 0 ? void 0 : _f.show();
        // Alert.info("子图全屏=功能实现中。。。")
        // 恢复缩放
        parentViewer.setScale(1);
        // 显示title
        let title = new NativeDiv();
        title.innerText(this.getName()).setColor((_g = this.getOption("nodeColor")) !== null && _g !== void 0 ? _g : "white").setFontSize(30).setStyle({
            fontWeight: "bold",
            marginTop: "10px",
            userSelect: "none",
            webkitUserSelect: "none",
            width: "100%",
            textAlign: "center"
        });
        nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.rootDom.add(title);
        // 聚焦首个节点
        setTimeout(() => {
            const nodes = nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.graph.getNodes();
            if (nodes && nodes.length) {
                nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.focusOnNode(nodes[0].id);
            }
        }, 500);
        let exit = () => {
            var _a, _b, _c, _d;
            this.exitFunc = null;
            // 清除恢复的缩放
            parentViewer.setScale(scale);
            nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.rootDom.setStyle(originStyle);
            // 恢复父级
            if (!parentViewer.graph.parentNode) {
                (_a = parentViewer.tools.miniMap) === null || _a === void 0 ? void 0 : _a.show();
            }
            if (parentViewer.graph.parentNode && parentViewer.rootDom.DOM.style.position == "absolute") {
                (_b = parentViewer.tools.miniMap) === null || _b === void 0 ? void 0 : _b.show();
            }
            (_c = parentViewer.tools.control) === null || _c === void 0 ? void 0 : _c.setFlex();
            // 删除按钮
            button.remove();
            title.remove();
            (_d = nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.tools.miniMap) === null || _d === void 0 ? void 0 : _d.hide();
            setTimeout(() => {
                nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.rootDom.setStyle({
                    transition: "none"
                });
            }, 500);
            // 恢复原本的 viewposition
            nowViewer.events.viewPosition = originViewPosition;
            nowViewer === null || nowViewer === void 0 ? void 0 : nowViewer.getNodeManager().setPosition();
        };
        this.exitFunc = exit;
    }
}
Object.defineProperty(NSubGraph, "NodeType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "subGraph"
}); //节点类型
Object.defineProperty(NSubGraph, "NodeLabel", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "子图"
}); //节点显示名
Object.defineProperty(NSubGraph, "NodePath", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "子图节点"
}); // 节点路径
