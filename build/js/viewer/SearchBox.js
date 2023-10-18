/*
 * @LastEditors: lisushuang
 * @Description: 搜索面板
 * @FilePath: /graph/src/viewer/SearchBox.ts
 * @Date: 2023-07-21 16:39:21
 * @LastEditTime: 2023-09-26 17:43:33
 * @Author: lisushuang
 */
import { NativeButton, NativeDiv } from "../shared";
import { NaiveInput } from "../shared/UI/NativeInput";
import { GraphEventTypes } from "../types";
class SearchBox extends NativeDiv {
    constructor(viewer) {
        super();
        Object.defineProperty(this, "viewer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "nodeManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputInstance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "nodesBox", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "pointer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "searchText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        /**
         * @description: 搜索用作创建？
         */
        Object.defineProperty(this, "isCreate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        this.viewer = viewer;
        this.nodeManager = this.viewer.graph.nodeManager;
        this.initBox();
        this.viewer.events.add(GraphEventTypes.DoubleLeftClick, (position, mouseInfo, e) => {
            if (e.target instanceof HTMLCanvasElement || e.target instanceof SVGElement) {
                // @mark 先判断这个
                // 如果自己就是子图，但是点击不在本子图节点的 widgets[0].viewerDom 内
                if (this.viewer.graph.parentNode) {
                    const viewer = this.viewer.graph.parentNode.widgets[0].viewerDom;
                    // 最小判断
                    if (position.x < 0 || position.y < 0 || position.x > viewer.getClientWidth() || position.y > viewer.getClientHeight()) {
                        return;
                    }
                }
                // @mark 子图画布内不触发搜索框
                if (!this.viewer.graph.isInSubgraph(position)) {
                    this.showBox(position);
                    return;
                }
                else {
                    this.hide();
                }
            }
            else {
                this.hide();
            }
        });
        this.viewer.events.add(GraphEventTypes.MouseDown, () => {
            this.hide();
        });
        this.onWheel((e) => {
            e.stopPropagation();
        });
    }
    /**
     * @description: 初始化整体box
     */
    initBox() {
        this.setPosition("absolute")
            .setWidth(200)
            .setHeight(200, 'min')
            .setBackgroundColor("black")
            .setStyle({
            opacity: "0.8",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            transformOrigin: "left top",
        })
            .setBorderRadius("20px")
            .setPadding("10px");
        this.DOM.addEventListener("dblclick", (e) => {
            e.stopPropagation();
        });
        this.onMousedown((e) => {
            e.stopPropagation();
        });
        // ESC 关闭 box
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape") {
                this.hide();
            }
        });
        this.initSearchInput();
        this.hide();
    }
    initSearchInput() {
        let inputBox = new NativeDiv();
        inputBox.setWidth("100%")
            .setHeight("20px")
            .setMarginBottom("10px");
        let input = new NaiveInput("", "请输入关键字搜索");
        input.setWidth("100%")
            .setStyle({
            opacity: "0.5",
            border: "0",
        })
            .setHeight("100%")
            .setBorderRadius("8px")
            .setPaddingLeft("10px")
            .setMarginLeft("-6px")
            .setColor("black")
            .setFontSize(14);
        input.onChange(() => {
            this.searchText = input.getValue();
            this.refreshNodes();
        });
        this.inputInstance = input;
        inputBox.add(input);
        this.add(inputBox);
        let toggle = new NativeDiv();
        toggle.setStyle({
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "5px"
        });
        this.add(toggle);
        let nodeButton = new NativeButton("新增节点");
        nodeButton.setWidth("49%")
            .onClick(() => {
            if (this.isCreate)
                return;
            this.isCreate = true;
            nodeButton.setBackgroundColor("white")
                .setColor("black");
            graphButton.setBackgroundColor("black")
                .setColor("white");
            this.refreshNodes();
        });
        let graphButton = new NativeButton("查询节点");
        graphButton.setWidth("49%")
            .setBackgroundColor("black")
            .setColor("white")
            .onClick(() => {
            if (!this.isCreate)
                return;
            this.isCreate = false;
            nodeButton.setBackgroundColor("black")
                .setColor("white");
            graphButton.setBackgroundColor("white")
                .setColor("black");
            this.refreshNodes();
        });
        toggle.add(nodeButton).add(graphButton);
    }
    /**
     * @description: 刷新节点
     */
    refreshNodes() {
        if (this.nodesBox === null) {
            this.nodesBox = new NativeDiv();
            this.nodesBox.setStyle({
                flexGrow: "1",
                overflowY: "auto",
                backgroundColor: "black",
                width: "100%",
                maxHeight: "200px",
                paddingTop: "5px"
            });
            this.add(this.nodesBox);
        }
        else {
            this.nodesBox.clear();
        }
        if (this.isCreate) {
            // 插入Node节点
            let nodes = this.nodeManager.getNodeTypeList();
            nodes.forEach(node => {
                if (this.searchText) {
                    if (node.label.indexOf(this.searchText) > -1 || node.type.indexOf(this.searchText) > -1) {
                        this.createNodeSelectItem(node);
                    }
                }
                else {
                    this.createNodeSelectItem(node);
                }
            });
        }
        else {
            // todo: 搜索蓝图数据的逻辑应当更精细一点，排除key值
            const data = this.viewer.serialize();
            const nodes = data.nodes;
            if (!nodes.length || !this.searchText)
                return;
            nodes.forEach(item => {
                var _a;
                if (JSON.stringify(item).indexOf(this.searchText) > -1) {
                    this.createNodeSelectItem({ label: `[${item.index}] ${(_a = item._label) !== null && _a !== void 0 ? _a : item.type}`, type: item.id });
                }
            });
        }
    }
    createNodeSelectItem(node) {
        var _a;
        let nodeBox = new NativeDiv();
        nodeBox.setColor("white")
            .setStyle({
            lineHeight: "1.5rem",
            paddingLeft: ".5rem",
            textAlign: "left"
        })
            .onMouseover(() => {
            nodeBox.setBackgroundColor("white")
                .setColor("black");
        });
        nodeBox.onMouseout(() => {
            nodeBox.setBackgroundColor("black")
                .setColor("white");
        });
        nodeBox.onClick(() => {
            if (this.isCreate) {
                const scale = this.viewer.events.getScale();
                let p = { x: this.pointer.x / scale - 60 - this.viewer.events.viewPosition.x / scale, y: this.pointer.y / scale - this.viewer.events.viewPosition.y / scale, z: 0 };
                this.viewer.addNode(node.type, p);
            }
            else {
                // const item = this.viewer.graph.getNode(node.type)
                this.viewer.focusOnNode(node.type);
            }
            this.hide();
        });
        nodeBox.DOM.innerText = node.label;
        (_a = this.nodesBox) === null || _a === void 0 ? void 0 : _a.add(nodeBox);
    }
    showBox(e) {
        var _a, _b;
        this.searchText = "";
        (_a = this.inputInstance) === null || _a === void 0 ? void 0 : _a.setValue("");
        this.pointer = e;
        const offsetScale = this.viewer.events.getParentScale();
        this.setLeft(e.x * offsetScale - 100 * offsetScale)
            .setTop(e.y * offsetScale - 20 * offsetScale)
            .setStyle({
            transform: `scale(${offsetScale})`,
        });
        this.refreshNodes();
        this.show();
        (_b = this.inputInstance) === null || _b === void 0 ? void 0 : _b.DOM.focus();
    }
    show() {
        this.setStyle({ display: "flex" });
        return this;
    }
}
export default SearchBox;
