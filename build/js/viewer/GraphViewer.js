/*
 * @Date: 2023-06-16 15:19:37
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-10-12 09:39:27
 * @FilePath: /bimcc-graph/src/viewer/GraphViewer.ts
 */
import { Graph, Node, SlotTypes, EventDataTypeStr } from "../core";
import { NativeDiv } from "../shared";
import { GraphAction, GraphEventTypes, NodeRenderEvents, RenderTargetTypes, RenderTypes } from "../types";
import { GraphEvents, MouseTargetTypes } from "./GraphEvents";
import { DomManager, SvgManager } from "../managers";
import SearchBox from "./SearchBox";
import ControlTools from "./ControlTools";
import { DomUIManager } from "../managers/DomUIManager";
import MiniMap from "./MiniMap";
import Alert from "../shared/UI/Alert";
import { config } from "../config";
import * as Utils from '../Utils';
import WidgetsManager from "../shared/UI/widgets/WidgetsManager";
/**
 * @description 视图展示蓝图
 */
export class GraphViewer {
    get registerNode() {
        return this.graph.registerNode.bind(this.graph);
    }
    get registerWidget() {
        return WidgetsManager.registerWidget.bind(this.graph);
    }
    get registerExternalGraph() {
        return this.graph.registerExternalGraph.bind(this.graph);
    }
    constructor(rootDom, graph = null, option = {
        controlShow: true,
        searchBoxShow: true,
        miniMapShow: true,
        readonly: false,
    }) {
        var _a;
        Object.defineProperty(this, "rootDom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); //视图展示的dom节点
        Object.defineProperty(this, "graph", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // 事件总线
        Object.defineProperty(this, "managers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        }); //渲染器列表
        Object.defineProperty(this, "renderTargetMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                [RenderTargetTypes.Node]: RenderTypes.Dom,
                [RenderTargetTypes.Link]: RenderTypes.Svg,
                [RenderTargetTypes.UI]: RenderTypes.DomUI,
            }
        });
        Object.defineProperty(this, "ActiveNodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "tools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "animate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        //获取自定义菜单方法列表
        Object.defineProperty(this, "customContextMenuFuncs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        WidgetsManager.initDefaultWidget();
        this.rootDom = new NativeDiv();
        this.rootDom.DOM = rootDom;
        this.rootDom.setStyle({
            overflow: "hidden",
            userSelect: "none",
            webkitUserSelect: "none"
        });
        // 阻止主画布的拖动事件，避免出现文字选择到外部元素，里面的拖动由mouse事件实现
        rootDom.addEventListener("dragstart", (e) => {
            e.preventDefault();
        });
        this.graph = graph !== null && graph !== void 0 ? graph : new Graph();
        this.events = new GraphEvents(this.rootDom, this);
        // 只读模式, 禁止执行事件
        if (option === null || option === void 0 ? void 0 : option.readonly) {
            this.events.setReadOnly(true);
        }
        const managers = [SvgManager, DomManager, DomUIManager];
        this.rootDom.setId(this.graph.id);
        this.rootDom.setAttribute('graph-id', this.graph.id);
        for (let Manager of managers) {
            const manager = new Manager(this.rootDom, this.events);
            this.managers[manager.type] = manager;
        }
        this.initEventListener();
        // 搜索面板
        if (option.searchBoxShow) {
            let search = new SearchBox(this);
            this.rootDom.add(search);
            this.tools.searchBox = search;
        }
        // 控制面板
        if (option.controlShow) {
            let ctrl = new ControlTools(this.graph, this.events);
            this.rootDom.add(ctrl);
            this.tools.control = ctrl;
        }
        // 小地图
        if (option.miniMapShow) {
            let minimap = new MiniMap(this);
            this.rootDom.add(minimap);
            this.tools.miniMap = minimap;
        }
        // 子图中不显示小地图，但元素要有
        if (this.graph.parentNode) {
            (_a = this.tools.miniMap) === null || _a === void 0 ? void 0 : _a.hide();
        }
    }
    /**
     * @description 建立事件监听和处理
     */
    initEventListener() {
        // =========== 按键事件处理 ============
        document.addEventListener("keydown", (e) => {
            if (e.code == "Delete") {
                if (GraphViewer.ActiveNode) {
                    if (this.graph.runningStatus == "stop") {
                        this.removeNode(GraphViewer.ActiveNode.node.id);
                    }
                }
            }
        });
        //============节点事件处理==========
        //当节点被拖动
        const dragNodeOffset = {
            x: 0,
            y: 0,
        };
        // 键盘事件 - 节点删除
        document.onkeydown = (e) => {
            if (e.key === 'Delete') {
                if (GraphViewer.ActiveNode) {
                    this.removeNode(GraphViewer.ActiveNode.node.id);
                }
                if (this.ActiveNodes.length > 0) {
                    for (const item of this.ActiveNodes) {
                        this.removeNode(item.node.id);
                    }
                }
            }
        };
        //右键菜单
        this.events.add(GraphEventTypes.OpenContextMenu, ({ position, type, target }) => {
            const uiManager = this.getRenderByTarget(RenderTargetTypes.UI);
            // 判断该点击是否在当前graph的某个子图内部？
            if (this.graph.isInSubgraph(position)) {
                uiManager.closeContextMenu();
                return;
            }
            // 如果自己就是子图，但是点击不在本子图节点的 widgets[0].viewerDom 内
            if (this.graph.parentNode) {
                const viewer = this.graph.parentNode.widgets[0];
                // 最小判断
                const offsetScale = viewer.viewer.events.getParentScale();
                if (position.x < 0 ||
                    position.y < 0 ||
                    position.x > viewer.viewerDom.getClientWidth() / offsetScale ||
                    position.y > viewer.viewerDom.getClientHeight() / offsetScale) {
                    uiManager.closeContextMenu();
                    return;
                }
            }
            if (!uiManager)
                return;
            let menu = [];
            switch (type) {
                case MouseTargetTypes.Widget:
                    const widget = target.widget;
                    if (widget.getContextMenu) {
                        menu = widget.getContextMenu();
                        break;
                    }
                    else {
                        this.events.dispatch(GraphEventTypes.CloseContextMenu);
                        return false;
                    }
                case MouseTargetTypes.Slot:
                    const slotRender = target.slotRender;
                    menu = [...slotRender.getContextMenu()];
                case MouseTargetTypes.Node:
                    const nodeRender = target.nodeRender;
                    // @mark 为节点的右键单独新增运行顺序插槽
                    menu = [...menu, {
                            label: "运行顺序",
                            subMenu: [
                                {
                                    label: "触发条件", callback: () => {
                                        nodeRender.node.addInput({
                                            label: "触发条件",
                                            valueType: [EventDataTypeStr],
                                            options: {
                                                remove: true
                                            }
                                        });
                                    }
                                },
                                {
                                    label: "执行后",
                                    callback: () => {
                                        nodeRender.node.addOutput({
                                            label: "执行后",
                                            valueType: EventDataTypeStr,
                                            options: {
                                                remove: true
                                            }
                                        });
                                    }
                                }
                            ]
                        }];
                    const colors = config.nodeStyles;
                    let colorMenu = [];
                    for (const color of colors) {
                        colorMenu.push({
                            label: color.name,
                            callback: () => {
                                nodeRender.node.setOption('nodeColor', color.nodeColor);
                                nodeRender.node.setOption('nodeTitleColor', color.nodeTitleColor);
                                nodeRender.node.setOption('nodeFontColor', color.nodeFontColor);
                                nodeRender.refresh();
                            }
                        });
                    }
                    menu = [...menu, null, {
                            label: "颜色",
                            subMenu: colorMenu
                        }];
                    menu = [...menu, null, ...nodeRender.getContextMenu()];
                    if (this.ActiveNodes.length) {
                        menu = [...menu, null, {
                                label: "批量操作",
                                subMenu: [
                                    {
                                        label: `克隆${this.ActiveNodes.length}个节点`,
                                        callback: () => {
                                            let newNodes = [];
                                            this.ActiveNodes.forEach(item => {
                                                var _a;
                                                let one = this.cloneNode(item.node.id);
                                                (_a = one === null || one === void 0 ? void 0 : one.render) === null || _a === void 0 ? void 0 : _a.setHighLight();
                                                newNodes.push(one === null || one === void 0 ? void 0 : one.render);
                                            });
                                            GraphViewer.ActiveNode = undefined;
                                            this.ActiveNodes.forEach(item => {
                                                item.cancelHighLight();
                                            });
                                            this.ActiveNodes = newNodes;
                                        }
                                    },
                                    {
                                        label: `删除${this.ActiveNodes.length}个节点`,
                                        callback: () => {
                                            GraphViewer.ActiveNode = undefined;
                                            this.ActiveNodes.forEach(item => {
                                                this.removeNode(item.node.id);
                                            });
                                            this.ActiveNodes = [];
                                        }
                                    },
                                    {
                                        label: `合并到子图`,
                                        callback: (position) => {
                                            this.mergeToSubgraph(this.ActiveNodes);
                                        }
                                    }
                                ]
                            }
                        ];
                    }
                case MouseTargetTypes.None:
                    if (menu.length > 0) {
                        menu = [...uiManager.getContextMenu(this), null, ...menu];
                    }
                    else {
                        menu = [...uiManager.getContextMenu(this)];
                    }
            }
            // 处理子图插槽
            if (this.graph.parentNode && (this.graph.parentNode.inputs.length !== 0 || this.graph.parentNode.outputs.length !== 0)) {
                const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
                const parentNode = this.graph.parentNode;
                const inMenu = [];
                const outMenu = [];
                const slotMenu = [];
                // 输入对应子图为输出
                if (parentNode.outputs.length !== 0) {
                    // 由于父节点输出只能对应一个值 所以子图输入是一一对应
                    let hasSubInput = false; // 是否有为创建的子图输入
                    for (let slot of parentNode.outputs) {
                        //如果子图输入已经在这个节点上面创建过就不能再创建了
                        if (slot.subGraphNode)
                            continue;
                        inMenu.push({
                            label: slot.label,
                            callback: (position) => {
                                var _a;
                                const inNode = this.addNode(this.graph.subGraphOutputType, position);
                                inNode.setParentSlot(slot);
                                (_a = nodeManager.getNodeRender(inNode.id)) === null || _a === void 0 ? void 0 : _a.refresh();
                            }
                        });
                        hasSubInput = true;
                    }
                    if (hasSubInput) {
                        slotMenu.push({
                            label: '外部输出',
                            subMenu: inMenu,
                        });
                    }
                }
                if (parentNode.inputs.length !== 0) {
                    slotMenu.push({
                        label: '外部输入',
                        subMenu: outMenu,
                    });
                    for (let slot of parentNode.inputs) {
                        outMenu.push({
                            label: slot.label,
                            callback: (position) => {
                                var _a;
                                const outNode = this.addNode(this.graph.subGraphInputType, position);
                                outNode.setParentSlot(slot);
                                (_a = nodeManager.getNodeRender(outNode.id)) === null || _a === void 0 ? void 0 : _a.refresh();
                            }
                        });
                    }
                }
                menu = [...menu, {
                        label: '子图插槽',
                        subMenu: slotMenu
                    }];
            }
            for (let func of this.customContextMenuFuncs) {
                menu = [...menu, ...func({ position, type, target })];
            }
            uiManager.openContextMenu(position, menu);
        });
        this.events.add(GraphEventTypes.CloseContextMenu, () => {
            const uiManager = this.getRenderByTarget(RenderTargetTypes.UI);
            if (!uiManager)
                return;
            uiManager.closeContextMenu();
        });
        // 节点拖动开始
        this.events.add(GraphEventTypes.DragNodeStart, (position, { nodeRender, }) => {
            const scale = this.events.getScale();
            dragNodeOffset.x = position.x / scale - nodeRender.node.position.x;
            dragNodeOffset.y = position.y / scale - nodeRender.node.position.y;
        });
        // 节点拖动中
        this.events.add(GraphEventTypes.DragNodeMove, (position, { nodeRender, }) => {
            const linkManager = this.getRenderByTarget(RenderTargetTypes.Link);
            const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
            if (!linkManager || !nodeManager)
                return;
            const scale = this.events.getScale();
            const pos = {
                x: position.x / scale - dragNodeOffset.x,
                y: position.y / scale - dragNodeOffset.y,
                z: 0,
            };
            const node = nodeRender.node;
            // 是否在多选节点中，此时进行多个节点的拖动
            if (this.ActiveNodes.indexOf(nodeRender) > -1) {
                const offsetDrag = {
                    x: pos.x - node.position.x,
                    y: pos.y - node.position.y
                };
                this.ActiveNodes.forEach(item => {
                    const newPos = {
                        x: item.node.position.x + offsetDrag.x,
                        y: item.node.position.y + offsetDrag.y,
                        z: 0
                    };
                    item.setPosition(newPos.x, newPos.y);
                    item.node.setPosition(newPos);
                });
            }
            else {
                nodeRender.setPosition(pos.x, pos.y);
                node.setPosition(pos);
            }
            linkManager.refresh();
        });
        //============插槽事件处理==========
        //插槽开始拖动
        this.events.add(GraphEventTypes.DragSlotStart, (position, { nodeRender, slotRender }) => {
            var _a, _b;
            if (this.graph.runningStatus === "running")
                return;
            const linkManager = this.getRenderByTarget(RenderTargetTypes.Link);
            const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
            if (!linkManager || !nodeManager)
                return;
            linkManager.displayTempLine(true);
            const slot = slotRender.slot;
            //如果是拖拽的是输入插槽并且本来就已经有连线了就需要断开原本的线并且把鼠标操作目标换成连线的输出插槽
            if (slot.type === SlotTypes.INPUT && !!slot.link) {
                const output = slot.link.origin;
                const link = slot.link;
                //删除掉数据的连线
                linkManager.removeLink(link.id);
                this.graph.removeLink(link);
                //刷新节点的显示
                (_a = nodeManager.getNodeRender(link.originNode.id)) === null || _a === void 0 ? void 0 : _a.refresh();
                (_b = nodeManager.getNodeRender(link.targetNode.id)) === null || _b === void 0 ? void 0 : _b.refresh();
                //替换掉鼠标操作对象
                this.events.mouseInfo.target = {
                    nodeRender,
                    slotRender: nodeManager.getSlotRender(output.node.id, output.index, true),
                };
            }
        });
        //当插槽被拖动
        this.events.add(GraphEventTypes.DragSlotMove, (position, { nodeRender, slotRender }) => {
            const linkManager = this.getRenderByTarget(RenderTargetTypes.Link);
            const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
            if (!linkManager || !nodeManager)
                return;
            const slot = slotRender.slot;
            let start = slotRender.getPosition();
            let end = slotRender.getPosition();
            let isDragEnd = true;
            if (slot.type === SlotTypes.INPUT) {
                start = position;
                isDragEnd = false;
            }
            else {
                end = position;
            }
            linkManager.setTempLine(start, end, isDragEnd);
        });
        //当插槽拖动完毕
        this.events.add(GraphEventTypes.DragSlotEnd, (position, { nodeRender, slotRender }) => {
            const linkManager = this.getRenderByTarget(RenderTargetTypes.Link);
            if (!linkManager)
                return;
            linkManager.displayTempLine(false);
            //判断此时鼠标在什么内部
            switch (this.events.mouseInfo.enterType) {
                case MouseTargetTypes.Node:
                    //拖拽到节点上
                    // const rNode : INodeRender = this.events.mouseInfo.enterTarget;
                    break;
                case MouseTargetTypes.Slot:
                    const rSlot = this.events.mouseInfo.enterTarget;
                    //拖拽到同类插槽
                    if (slotRender.slot.type === rSlot.slot.type)
                        return;
                    //拖拽到同一个节点
                    if (slotRender.slot.node === rSlot.slot.node)
                        return;
                    if (slotRender.slot.type === SlotTypes.INPUT) {
                        this.addLink(rSlot.slot.node.id, rSlot.slot.index, slotRender.slot.node.id, slotRender.slot.index);
                    }
                    else {
                        this.addLink(slotRender.slot.node.id, slotRender.slot.index, rSlot.slot.node.id, rSlot.slot.index);
                    }
                    break;
                case MouseTargetTypes.None:
                    break;
            }
            linkManager.refresh();
        });
        //==============视图事件处理==========
        //当视图被拖动
        this.events.add(GraphEventTypes.DragViewMove, (position) => {
            const linkManager = this.getRenderByTarget(RenderTargetTypes.Link);
            const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
            if (!linkManager || !nodeManager)
                return;
            // @mark transform 放到外部dom中
            nodeManager.setPosition();
            // nodeManager.refresh();
            linkManager.refresh();
        });
        // 当视图被缩放
        this.events.add(GraphEventTypes.ViewScale, (scale) => {
            const linkManager = this.getRenderByTarget(RenderTargetTypes.Link);
            const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
            nodeManager.setPosition();
            linkManager.refresh();
        });
        // 处理节点非高亮
        this.events.add(GraphEventTypes.MouseDown, () => {
            var _a;
            if (this.ActiveNodes.length) {
                for (const node of this.ActiveNodes) {
                    node.cancelHighLight();
                }
                this.ActiveNodes = [];
            }
            if (GraphViewer.ActiveNode && !this.graph.checkNodeRuned(GraphViewer.ActiveNode.node)) {
                (_a = GraphViewer.ActiveNode) === null || _a === void 0 ? void 0 : _a.cancelHighLight();
                GraphViewer.ActiveNode = undefined;
            }
        });
        // 处理节点点击高亮
        this.events.add(GraphEventTypes.NodeDown, (e, node) => {
            // 点击节点也要关闭右键菜单
            const uiManager = this.getRenderByTarget(RenderTargetTypes.UI);
            uiManager.closeContextMenu();
            if (GraphViewer.ActiveNode && !this.graph.checkNodeRuned(GraphViewer.ActiveNode.node)
                && this.ActiveNodes.indexOf(node) == -1 // 被点击的节点不在多选高亮中
            ) {
                GraphViewer.ActiveNode.cancelHighLight();
                this.ActiveNodes.forEach(item => {
                    item.cancelHighLight();
                });
                this.ActiveNodes = [];
            }
            node.setHighLight();
            node.node.events.dispatch(NodeRenderEvents.Down, node);
            GraphViewer.ActiveNode = node;
        });
        // 框选后处理高亮
        this.events.add(GraphEventTypes.SelectedNode, (sPos, ePos) => {
            const DomRender = this.managers['DomRender'];
            const nodes = DomRender.getAllNodes();
            this.ActiveNodes = []; // 清空选中节点
            // 考虑缩放时
            const scale = this.events.getScale();
            for (const node of nodes) {
                const xPos = node.node.position.x * scale + this.events.viewPosition.x;
                const yPos = node.node.position.y * scale + this.events.viewPosition.y;
                const width = node.getContent().getClientWidth() * scale;
                const height = node.getContent().getClientHeight() * scale;
                const xArr = [xPos, xPos + width];
                const yArr = [yPos, yPos + height];
                const xArrPos = [sPos.x, ePos.x];
                const yArrPos = [sPos.y, ePos.y];
                const isIntersect = (arr1, arr2) => {
                    let start = [Math.min(...arr1), Math.min(...arr2)]; //区间的两个最小值
                    let end = [Math.max(...arr1), Math.max(...arr2)]; //区间的两个最大值
                    return Math.max(...start) <= Math.min(...end); //最大值里的最小值 是否 小于等于 最大值的最小值
                };
                if (isIntersect(xArr, xArrPos) && isIntersect(yArr, yArrPos)) {
                    this.ActiveNodes.push(node);
                    node.setHighLight();
                }
                else {
                    node.cancelHighLight();
                }
            }
        });
        // 打开关联节点列表
        this.events.add(GraphEventTypes.OpenAssociativeMenu, (position, { nodeRender, slotRender }) => {
            const uiManager = this.getRenderByTarget(RenderTargetTypes.UI);
            if (!uiManager)
                return;
            const node = nodeRender.node;
            if (node.associativeNode.length > 0) {
                const list = [];
                const infos = this.graph.getNodeClassInfo();
                for (let type in infos) {
                    if (node.associativeNode.indexOf(type) !== -1) {
                        list.push(infos[type]);
                    }
                }
                uiManager.openAssociativeMenu(node, slotRender.slot, position, list);
            }
        });
        // 关闭关联节点列表
        this.events.add(GraphEventTypes.CloseAssociativeMenu, () => {
            const uiManager = this.getRenderByTarget(RenderTargetTypes.UI);
            if (!uiManager)
                return;
            uiManager.closeAssociativeMenu();
        });
        this.events.add(GraphEventTypes.DoubleLeftClick, (position, mouseInfo, e) => {
            const uiManager = this.getRenderByTarget(RenderTargetTypes.UI);
            if (!uiManager)
                return;
            switch (mouseInfo.type) {
                case MouseTargetTypes.Node:
                    const nr = mouseInfo.target.nodeRender;
                    this.focusOnNode(nr.node.id, false, () => {
                        uiManager.openNodePanel(nr);
                    });
                    break;
            }
        });
        // ===================蓝图动作================
        // 蓝图添加节点
        this.events.add(GraphAction.AddNode, (type, position = { x: 0, y: 0, z: 0 }, properties = {}, options = {}) => {
            this.addNode(type, position, properties, options);
        });
        this.events.add(GraphAction.RemoveNode, (id) => {
            this.removeNode(id);
        });
        this.events.add(GraphAction.CloneNode, (id) => {
            var _a, _b;
            let node = this.cloneNode(id);
            (_a = GraphViewer.ActiveNode) === null || _a === void 0 ? void 0 : _a.cancelHighLight();
            (_b = node === null || node === void 0 ? void 0 : node.render) === null || _b === void 0 ? void 0 : _b.setHighLight();
        });
        this.events.add(GraphAction.AddNodeInput, (nr, option) => {
            nr.node.addInput(option);
            nr.refresh();
        });
        this.events.add(GraphAction.AddNodeOutput, (nr, option) => {
            nr.node.addOutput(option);
            nr.refresh();
        });
        this.events.add(GraphAction.FocusOnNode, (id, needShake = true, onFinish) => {
            this.focusOnNode(id, needShake, onFinish);
        });
        this.events.add(GraphAction.RemoveNodeSlot, (slotRender) => {
            const slot = slotRender.slot;
            this.removeSlot(slot);
        });
    }
    /**
     * @description 根据渲染目标获取渲染器
     * @param value
     * @returns
     */
    getRenderByTarget(value) {
        return this.managers[this.renderTargetMap[value]];
    }
    getNodeManager() {
        return this.managers['DomRender'];
    }
    /**
     * @description 添加一个节点到蓝图中
     * @param type
     * @param position
     * @param properties
     * @param options
     */
    addNode(type, position = { x: 0, y: 0, z: 0 }, properties = {}, options = {}) {
        const node = this.graph.createNode(type, position, properties, options);
        const render = this.getRenderByTarget(RenderTargetTypes.Node);
        if (!render)
            return null;
        let r = render.addNode(node);
        node.setRender(r);
        node.setViewer(this);
        return node;
    }
    /**
     * @description 连接两个节点
     * @param originId
     * @param originIndex
     * @param targetId
     * @param targetIndex
     */
    addLink(originId, originIndex, targetId, targetIndex) {
        const linkManager = this.getRenderByTarget(RenderTargetTypes.Link);
        const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
        if (!linkManager || !nodeManager)
            return null;
        const origin = this.graph.getNode(originId);
        const target = this.graph.getNode(targetId);
        //不存在这个node
        if (!origin || !target)
            return;
        //没有这个插槽
        if (origin.outputs.length <= originIndex || target.inputs.length <= targetIndex)
            return;
        const input = target.inputs[targetIndex];
        const beforeLink = input.link;
        // 数据上添加连接
        const link = this.graph.addLink(origin, originIndex, target, targetIndex);
        // 无法连接
        if (!link)
            return;
        // 如果这个输入插槽已经有连接了 样式上删除
        if (beforeLink) {
            linkManager.removeLink(beforeLink.id);
            const iSlot = nodeManager.getSlotRender(beforeLink.originNode.id, beforeLink.origin.index, true);
            iSlot === null || iSlot === void 0 ? void 0 : iSlot.setLinked(false);
        }
        //节点渲染
        const orNode = nodeManager.getNodeRender(originId);
        const trNode = nodeManager.getNodeRender(targetId);
        if (!orNode || !trNode)
            return;
        //插槽渲染
        const rOut = orNode.getOutput(originIndex);
        const rIn = trNode.getInput(targetIndex);
        if (!rOut || !rIn)
            return;
        linkManager.addLink(link, rOut, rIn);
        // 重绘节点
        orNode.refresh();
        trNode.refresh();
    }
    /**
     * @description 克隆一个节点
     * @param id
     */
    cloneNode(id) {
        const node = this.graph.getNode(id);
        if (!node)
            return;
        if (node.options['notClone'])
            return;
        const offset = {
            x: 20,
            y: 20,
        };
        let data = node.serialize();
        data.id = Node.createId();
        data.position = [
            node.position.x + offset.x,
            node.position.y + offset.y,
            node.position.z,
        ];
        this.graph.nodeManager.deserializeNode(data);
        const newNode = this.graph.getNode(data.id);
        const render = this.getRenderByTarget(RenderTargetTypes.Node);
        let r = render.addNode(newNode);
        newNode.setRender(r);
        newNode.setViewer(this);
        newNode.deserialize(data);
        return newNode;
    }
    /**
     * @description 删除node
     * @param id
     */
    removeNode(id) {
        const linkManager = this.getRenderByTarget(RenderTargetTypes.Link);
        const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
        if (!linkManager || !nodeManager)
            return;
        const node = this.graph.getNode(id);
        if (!node)
            return;
        for (let link of node.getAllLinks()) {
            linkManager.removeLink(link.id);
        }
        nodeManager.removeNode(id);
        this.graph.removeNode(id);
        nodeManager.refresh();
    }
    /**
     * @description 删除连接
     * @param id
     */
    removeLink(id) {
        const linkManager = this.getRenderByTarget(RenderTargetTypes.Link);
        const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
        if (!linkManager || !nodeManager)
            return;
        this.graph.removeLinkById(id);
        linkManager.removeLink(id);
        nodeManager.refresh();
    }
    /**
     * @description: 手动设置缩放
     * @param {number} scale
     */
    setScale(scale) {
        this.events.setScale(scale);
    }
    /**
     * @description 根据当前viewer的graph刷新显示
     * @param { boolean } needFocus 是否自动聚焦到第一个节点
     */
    refresh(needFocus = false) {
        // todo bug 清空原本渲染的内容
        // 开始恢复节点渲染
        const nodes = this.graph.getNodes();
        const render = this.getRenderByTarget(RenderTargetTypes.Node);
        nodes.forEach(element => {
            if (!render)
                return null;
            let r = render.addNode(element);
            element.setRender(r);
            element.setViewer(this);
        });
        // 开始恢复连线渲染实例
        const links = this.graph.getLinks();
        const linkManager = this.getRenderByTarget(RenderTargetTypes.Link);
        links.forEach((link) => {
            // 获取节点渲染实例
            const orNode = render.getNodeRender(link.originNode.id);
            const trNode = render.getNodeRender(link.targetNode.id);
            if (!orNode || !trNode)
                return;
            // 获取插槽渲染实例
            const rOut = orNode.getOutput(link.origin.index);
            const rIn = trNode.getInput(link.target.index);
            if (!rOut || !rIn)
                return;
            linkManager.addLink(link, rOut, rIn);
            // 重绘节点
            orNode.refresh();
            trNode.refresh();
        });
        if (nodes.length > 0 && needFocus) {
            this.focusOnNode(nodes[0].id, false);
        }
    }
    /**
     * @description 序列化
     * @returns
     */
    serialize() {
        let data = this.graph.serialize();
        // 添加视图位置
        return Object.assign({
            viewPosition: this.events.viewPosition,
        }, data);
    }
    /**
     * @description 反序列化
     * @param data
     */
    deserialize(data) {
        // 首先恢复数据
        this.graph.deserialize(data);
        const render = this.getRenderByTarget(RenderTargetTypes.Node);
        if (data.viewPosition) {
            this.events.viewPosition = data.viewPosition;
            render.setPosition();
        }
        this.refresh();
    }
    /**
     * @description: 清空并重置画布
     */
    clearAll() {
        const nodes = this.graph.getNodes();
        nodes.forEach((node) => {
            this.graph.removeNode(node.id);
        });
        const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
        const linkManager = this.getRenderByTarget(RenderTargetTypes.Link);
        linkManager.clear();
        nodeManager.root.clear();
        // 停止运行
        setTimeout(() => {
            this.events.dispatch(GraphAction.StopRun);
        }, 0);
        // 恢复起始位置
        this.events.viewPosition.x = 0;
        this.events.viewPosition.y = 0;
        nodeManager.setPosition();
        // 恢复缩放等级
        this.events.setScale(1);
    }
    /**
     * @description 定位到节点
     * @param id
     * @returns
     */
    focusOnNode(id, needShake = true, onFinish) {
        cancelAnimationFrame(this.animate);
        let node = null;
        if (!id) {
            let nodes = this.graph.getNodes();
            if (nodes.length) {
                node = nodes[0];
            }
        }
        else {
            node = this.graph.getNode(id);
        }
        if (!node)
            return;
        const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
        const originScale = this.events.getScale();
        const nr = nodeManager.getNodeRender(node.id);
        let startTime = 0;
        // 直接计算实际位置
        const newPos = {
            x: ((-node.position.x * originScale + this.rootDom.DOM.getBoundingClientRect().width / 2) - (nr.getContent().getBoundingClientRect().width / 2)),
            y: ((-node.position.y * originScale + this.rootDom.DOM.getBoundingClientRect().height / 2) - (nr.getContent().getBoundingClientRect().height / 2))
        };
        // 位置差
        const stepPos = { x: newPos.x - this.events.viewPosition.x, y: newPos.y - this.events.viewPosition.y };
        const animationDuration = this.graph.stepTime * 0.6; // 动画持续时间（毫秒）
        const initialPos = this.events.viewPosition; // 获取初始位置
        if (!id) {
            this.events.viewPosition = stepPos;
            nodeManager.setPosition();
            return;
        }
        // @mark 此动画在CPU或GPU繁忙时（帧率低）可能会有未知的卡顿导致最终停止的位置不对
        let animate = (timestamp) => {
            if (!startTime)
                startTime = timestamp;
            // 计算动画已经进行的时间
            const elapsedTime = timestamp - startTime;
            // 计算新的位置
            const newPosX = initialPos.x + (stepPos.x * (elapsedTime / animationDuration));
            const newPosY = initialPos.y + (stepPos.y * (elapsedTime / animationDuration));
            this.events.viewPosition = { x: newPosX, y: newPosY };
            // 更新位置
            nodeManager.setPosition();
            // 判断是否继续动画
            if (elapsedTime <= animationDuration) {
                this.animate = requestAnimationFrame(animate);
            }
            else {
                onFinish && onFinish();
            }
        };
        this.animate = requestAnimationFrame(animate);
        if (needShake) {
            setTimeout(() => {
                var _a;
                (_a = node.render) === null || _a === void 0 ? void 0 : _a.shake();
            }, this.graph.stepTime * 0.5);
        }
    }
    /**
     * @description 添加获取自定义菜单的方法
     * @param func 获取方法需要返回一个menu对象
     */
    addCustomContextMenuFunc(func) {
        this.customContextMenuFuncs.push(func);
    }
    /**
     * @description: 获取当前高亮的节点数据
     */
    getActiveNode() {
        var _a;
        return (_a = GraphViewer.ActiveNode) === null || _a === void 0 ? void 0 : _a.node;
    }
    /**
     * @description 删除节点插槽
     */
    removeSlot(slot) {
        if (!slot.options['remove'])
            return;
        const nodeManager = this.getRenderByTarget(RenderTargetTypes.Node);
        if (!nodeManager)
            return;
        const node = slot.node;
        if (slot.type === SlotTypes.INPUT) {
            if (slot.link) {
                this.removeLink(slot.link.id);
            }
        }
        else {
            if (slot.link.length > 0) {
                for (let lk of slot.link) {
                    this.removeLink(lk.id);
                }
            }
        }
        this.graph.removeSlot(slot);
        const nr = nodeManager.getNodeRender(node.id);
        nr === null || nr === void 0 ? void 0 : nr.refresh();
    }
    setViewerMode() {
        this.events.setReadOnly(true);
    }
    disbleViewerMode() {
        this.events.setReadOnly(false);
    }
    /**
     * @description 合并到子图
     */
    mergeToSubgraph(renders) {
        if (!Utils.isContinuousNodes(renders))
            return Alert.warning('[警告]选中节点并非连续节点，无法合并为子图');
        const position = renders[0].getPosition();
        //子图外部节点对象
        const subViewerNode = this.addNode(this.graph.subGraphType, {
            x: position.x,
            y: position.y,
            z: 0
        });
        //子图viewer对象
        const subViewer = subViewerNode.subViewer;
        //偏移值
        const offset = Object.assign({}, position);
        //外部节点id映射到内部id
        const outToSubIdMap = {};
        const subNodeMap = {};
        //创建子图内部的节点和外部连线的修改
        for (let nr of renders) {
            const node = nr.node;
            let data = node.serialize();
            data.id = Node.createId();
            data.position = [
                node.position.x - offset.x,
                node.position.y - offset.y,
                node.position.z,
            ]; //减去偏移量
            //克隆节点一个到子图中
            subViewer.graph.nodeManager.deserializeNode(data);
            const newNode = subViewer.graph.getNode(data.id);
            const subManager = subViewer.getRenderByTarget(RenderTargetTypes.Node);
            let r = subManager.addNode(newNode);
            newNode.setRender(r);
            newNode.setViewer(subViewer);
            newNode.deserialize(data);
            //处理外部输入连线
            for (let input of node.inputs.concat()) {
                if (!input.link)
                    continue;
                const link = input.link;
                if (renders.indexOf(input.link.originNode.render) === -1) {
                    // 有连线且不是内部的连线
                    const slot = subViewerNode.addInput({
                        label: input.label,
                        valueType: input.valueType.concat(),
                        options: {
                            isVertical: !!input.options.isVertical
                        },
                        defaultValue: input.defaultValue,
                    });
                    //子图插槽节点
                    const subSlotNode = subViewer.addNode(this.graph.subGraphInputType, {
                        x: newNode.position.x - 128 - 100,
                        y: newNode.position.y - (input.index * 40),
                        z: newNode.position.z,
                    });
                    subSlotNode.setParentSlot(slot);
                    //子图内部连接
                    subViewer.addLink(subSlotNode.id, 0, newNode.id, input.index);
                    //子图外部连接
                    this.addLink(input.link.originNode.id, input.link.origin.index, subViewerNode.id, slot.index);
                    this.removeLink(input.link.id);
                }
                else {
                    // 内部连线
                    // 是否已经生成过内部节点
                    if (outToSubIdMap[link.originNode.id]) {
                        const orginSubNode = subNodeMap[outToSubIdMap[link.originNode.id]];
                        subViewer.addLink(orginSubNode.id, link.origin.index, newNode.id, link.target.index);
                    }
                }
            }
            //外部输出
            for (let output of node.outputs) {
                let hasLink = false; //已经创建了内部连接了
                for (let link of output.link.concat()) {
                    if (renders.indexOf(link.targetNode.render) === -1) {
                        const slot = subViewerNode.addOutput({
                            label: output.label,
                            valueType: output.valueType.concat(),
                            options: {
                                isVertical: !!output.options.isVertical
                            },
                            defaultValue: output.defaultValue,
                        });
                        //内部代表插槽的节点
                        const subSlotNode = subViewer.addNode(this.graph.subGraphOutputType, {
                            x: newNode.position.x + 128 + 100,
                            y: newNode.position.y - (output.index * 40),
                            z: newNode.position.z,
                        });
                        subSlotNode.setParentSlot(slot);
                        if (!hasLink) {
                            //子图内部连接
                            subViewer.addLink(newNode.id, output.index, subSlotNode.id, 0);
                            hasLink = true;
                        }
                        //子图外部连接
                        this.addLink(subViewerNode.id, slot.index, link.targetNode.id, link.target.index);
                    }
                    else {
                        // 内部连线
                        // 是否已经生成过内部节点
                        if (outToSubIdMap[link.targetNode.id]) {
                            const targetSubNode = subNodeMap[outToSubIdMap[link.targetNode.id]];
                            subViewer.addLink(newNode.id, link.origin.index, targetSubNode.id, link.target.index);
                        }
                    }
                }
            }
            outToSubIdMap[node.id] = newNode.id;
            subNodeMap[newNode.id] = newNode;
        }
        //删除原本的
        for (let nr of renders) {
            this.removeNode(nr.node.id);
        }
    }
}
