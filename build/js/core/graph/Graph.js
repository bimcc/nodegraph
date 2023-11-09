/*
 * @Date: 2023-06-15 09:26:16
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-11-09 18:09:18
 * @FilePath: /bimcc-graph/src/core/graph/Graph.ts
 */
import { GraphAction, GraphEventTypes } from "../../types";
import { DataTypeMananger, NodeManager } from '../graph';
import { EventDataTypeStr } from "../interfaces";
import { config } from '../../config';
import { nanoid } from "nanoid";
/**
 * @description 蓝图基类
 */
export class Graph {
    /**
     * @description 作为子图时的输入
     */
    get inputs() {
        if (!this.parentNode)
            return null;
        return this.parentNode.inputs;
    }
    /**
     * @description 作为子图时的输出
     */
    get outputs() {
        if (!this.parentNode)
            return null;
        return this.parentNode.outputs;
    }
    get createNode() {
        return this.nodeManager.createNode.bind(this.nodeManager);
    }
    get getNode() {
        return this.nodeManager.getNode.bind(this.nodeManager);
    }
    get removeNode() {
        return this.nodeManager.removeNode.bind(this.nodeManager);
    }
    get addLink() {
        return this.nodeManager.addLink.bind(this.nodeManager);
    }
    get removeLink() {
        return this.nodeManager.removeLink.bind(this.nodeManager);
    }
    get removeLinkById() {
        return this.nodeManager.removeLinkById.bind(this.nodeManager);
    }
    get getNodeClassInfo() {
        return this.nodeManager.getNodeClassInfo.bind(this.nodeManager);
    }
    get getNodes() {
        return this.nodeManager.getNodes.bind(this.nodeManager);
    }
    get getChildrenNodes() {
        return this.nodeManager.getChildrenNodes.bind(this.nodeManager);
    }
    get getLinks() {
        return this.nodeManager.getLinks.bind(this.nodeManager);
    }
    get registerNode() {
        return this.nodeManager.register.bind(this.nodeManager);
    }
    get removeSlot() {
        return this.nodeManager.removeSlot.bind(this.nodeManager);
    }
    constructor() {
        Object.defineProperty(this, "subGraphType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'subGraph'
        });
        Object.defineProperty(this, "subGraphInputType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'subGraphInput'
        });
        Object.defineProperty(this, "subGraphOutputType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'subGraphOutput'
        });
        /**
         * @description 子图父节点是一个Node 子图的input和output来自于这个Node
         */
        Object.defineProperty(this, "parentNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "viewer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: '1.00'
        }); // 版本号 
        Object.defineProperty(this, "nodeManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // 游离子图对象
        Object.defineProperty(this, "externalGraph", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        // 运行状态
        Object.defineProperty(this, "runningStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "stop"
        });
        // 暂停等待的节点数组，事件或者异步节点
        Object.defineProperty(this, "pauseNodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "eventRuns", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        // 已经运行的节点
        Object.defineProperty(this, "runedNodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        // 执行的延迟器
        Object.defineProperty(this, "runtimers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        // 步骤间隔时间 ms
        Object.defineProperty(this, "stepTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 500
        });
        Object.defineProperty(this, "waitNodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.id = `graph-${nanoid(6)}`;
        DataTypeMananger.get();
        this.nodeManager = new NodeManager(this);
    }
    /**
     * @description 序列化蓝图
     */
    serialize() {
        const nodeData = this.nodeManager.serialize();
        return Object.assign({
            version: this.version,
        }, nodeData);
    }
    /**
     * @description 反序列化蓝图
     */
    deserialize({ nodes, links, }) {
        this.nodeManager.deserialize({ nodes, links, });
    }
    /**
     * @description: 开始运行
     */
    start() {
        if (this.runningStatus == "running")
            return;
        this.runningStatus = "running";
        // 所有的Node
        let nodes = this.getNodes();
        // 找到没有输入的Node
        let startNode = [];
        nodes.forEach(node => {
            // 没有inputs的节点
            if (node.inputs.length == 0) {
                startNode.push(node);
                return;
            }
            // 有inputs 但全都没连线
            let hasInputLink = false;
            node.inputs.forEach(input => {
                if (input.link) {
                    hasInputLink = true;
                }
            });
            if (!hasInputLink) {
                startNode.push(node);
            }
        });
        // 按节点离第一个节点的绝对距离排序
        let startAndDistance = [];
        if (startNode.length) {
            startNode.forEach((item, index) => {
                if (index == 0) {
                    startAndDistance.push({ node: item, dis: 0 });
                }
                else {
                    let x = item.position.x - startNode[0].position.x;
                    let y = item.position.y - startNode[0].position.y;
                    let dis = Math.sqrt(x * x + y * y);
                    startAndDistance.push({ node: item, dis });
                }
            });
        }
        // 按距离近远排序
        startAndDistance.sort((a, b) => {
            return a.dis - b.dis;
        });
        startAndDistance.forEach((item, index) => {
            startNode[index] = item.node;
        });
        // startNode.forEach((node, index) => {
        //   let timer = setTimeout(() => {
        //     if (this.runningStatus == "running") {
        //       this.nodeRunning(node);
        //     }
        //   }, this.stepTime * index);
        //   this.runtimers.push(timer);
        // });
        startNode.forEach((item) => {
            this.waitNodes.push({ node: item, eventNode: null });
        });
        this.runByStep();
    }
    checkNodeRuned(node, eventNode = null) {
        if (eventNode && this.eventRuns[eventNode.id]) {
            for (let i = 0; i < this.eventRuns[eventNode.id].length; i++) {
                const n = this.eventRuns[eventNode.id][i];
                if (n.id == node.id) {
                    return true;
                }
            }
        }
        else {
            for (let i = 0; i < this.runedNodes.length; i++) {
                const n = this.runedNodes[i];
                if (n.id == node.id) {
                    return true;
                }
            }
        }
        return false;
    }
    runByStep(eventNode = null) {
        var _a, _b, _c, _d;
        if (!this.waitNodes.length)
            return;
        let nowNode = this.waitNodes.shift();
        if (!nowNode)
            return;
        // 当前就是事件节点自己，清空运行状态
        if (nowNode.eventNode && nowNode.node.id == nowNode.eventNode.id && this.eventRuns[nowNode.eventNode.id] && this.eventRuns[nowNode.eventNode.id].length) {
            this.eventRuns[nowNode.eventNode.id].forEach(node => {
                var _a;
                (_a = node.render) === null || _a === void 0 ? void 0 : _a.cancelHighLight();
                this.runedNodes = this.runedNodes.filter((value) => {
                    return value.id !== node.id;
                });
            });
            this.eventRuns[nowNode.eventNode.id] = [];
        }
        if (this.checkIfCanRun(nowNode.node, nowNode.eventNode)) {
            // 聚焦到节点
            (_a = nowNode.node.render) === null || _a === void 0 ? void 0 : _a.events.dispatch(GraphAction.FocusOnNode, nowNode.node.id);
            // 节点执行
            this.realRun(nowNode.node, nowNode.eventNode);
            nowNode.node.outputs.forEach(output => {
                if (output.link && output.link.length) {
                    output.link.forEach(link => {
                        if (link.target.node) {
                            this.waitNodes.unshift({ node: link.target.node, eventNode: nowNode.eventNode });
                        }
                    });
                }
            });
        }
        else {
            // 没运行的说明在等待依赖值
            if (!this.checkNodeRuned(nowNode.node, nowNode.eventNode)) {
                (_b = nowNode.node.render) === null || _b === void 0 ? void 0 : _b.events.dispatch(GraphAction.FocusOnNode, nowNode.node.id);
                (_c = nowNode.node.render) === null || _c === void 0 ? void 0 : _c.setHighLight(config.style.NodeHighLightColor);
                (_d = nowNode.node.render) === null || _d === void 0 ? void 0 : _d.shake();
            }
        }
        setTimeout(() => {
            this.runByStep();
        }, this.stepTime);
    }
    /**
     * @description: 检查该节点是否能够被执行
     * @param {INode} node 检查的节点
     * @param {INode} eventNode 本次事件触发的节点
     * @return {boolean}
     */
    checkIfCanRun(node, eventNode = null) {
        var _a;
        if (this.runningStatus !== "running")
            return false;
        // 无事件标识，且已经被运行过
        if (this.checkNodeRuned(node) && !eventNode)
            return false;
        if (eventNode && this.checkNodeRuned(node, eventNode))
            return false;
        // 查看所有的input是否已经准备好
        // 先判断inputs节点是否已经被执行
        let prepared = true;
        // 找到起始节点
        for (let index = 0; index < node.inputs.length; index++) {
            const element = node.inputs[index];
            let has = false;
            for (let j = 0; j < this.runedNodes.length; j++) {
                const n = this.runedNodes[j];
                if (n.id == ((_a = element.link) === null || _a === void 0 ? void 0 : _a.origin.node.id)) {
                    has = true;
                }
            }
            if (!has)
                prepared = false;
            // 未连线，但本身是可填的，如果已连线，则必须等待
            if (!prepared && !element.link && element.allow_input) {
                prepared = true;
            }
            // 跳过 trigger input
            if (!prepared && !element.link && element.valueType.indexOf(EventDataTypeStr) > -1) {
                prepared = true;
            }
            // @mark 一旦有一个input没有准备好，立马就跳出循环
            if (!prepared)
                break;
        }
        // 依赖值未准备好
        if (!prepared) {
            this.sendLog(node, "等待依赖值中。。。");
            return false;
        }
        if (node.isEvent) {
            // 已经在等待的节点应当直接往后执行，并带上事件参数
            for (let index = 0; index < this.pauseNodes.length; index++) {
                const element = this.pauseNodes[index];
                if (element.id == node.id) {
                    if (eventNode && eventNode.id == element.id) {
                        // 必须要是强制执行的事件才能从这儿走
                        this.sendLog(node, "事件【被触发】");
                        // 必然是事件
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            // 等待节点处理
            this.pauseNodes.push(node);
            // 事件节点仅在等待时才能onTrigger，执行时不需要
            node.onTrigger();
            this.sendLog(node, "事件等待中。。。");
            return false;
        }
        else {
            this.sendLog(node);
            // this.runedNodes.push(node)
            node.onTrigger();
            return true;
        }
    }
    /**
     * @description : 节点运行统一方法
     * @param {INode} node 需要运行的节点
     * @param {INode} eventNode 触发事件的节点
     * @return {*}
     */
    nodeRunning(node, eventNode = null) {
        if (this.runningStatus !== "running")
            return;
        if (!this.waitNodes.length) {
            this.waitNodes.push({ node: node, eventNode: eventNode });
            this.runByStep();
        }
        else {
            this.waitNodes.push({ node: node, eventNode: eventNode });
        }
    }
    realRun(node, eventNode = null) {
        this.runedNodes.push(node);
        if (eventNode) {
            if (!this.eventRuns[eventNode.id]) {
                this.eventRuns[eventNode.id] = [];
            }
            this.eventRuns[eventNode.id].push(node);
        }
        let timer = window.setTimeout(() => {
            var _a, _b, _c;
            (_a = node.render) === null || _a === void 0 ? void 0 : _a.events.dispatch(GraphEventTypes.LinksFresh, this.runedNodes);
            node.run(eventNode);
            if (eventNode) {
                (_b = node.render) === null || _b === void 0 ? void 0 : _b.shake();
            }
            (_c = node.render) === null || _c === void 0 ? void 0 : _c.setHighLight(eventNode ? config.style.NodeEventColor : config.style.NodeRunningColor);
            // 先刷新线，再修改已运行节点
        }, this.stepTime);
        this.runtimers.push(timer);
    }
    /**
     * @description: 暂停运行
     */
    pause() {
    }
    /**
     * @description: 停止运行
     */
    stop() {
        var _a, _b;
        this.runningStatus = "stop";
        this.waitNodes = [];
        this.getNodes().forEach(node => {
            var _a;
            (_a = node.render) === null || _a === void 0 ? void 0 : _a.cancelHighLight();
            if (node.onStop) {
                node.onStop();
            }
        });
        let timer = null;
        while (timer = this.runtimers.shift()) {
            clearTimeout(timer);
        }
        (_b = (_a = this.runedNodes[0]) === null || _a === void 0 ? void 0 : _a.render) === null || _b === void 0 ? void 0 : _b.events.dispatch(GraphEventTypes.LinksFresh);
        this.runedNodes = [];
        this.pauseNodes = [];
    }
    sendLog(node, msg = "已运行") {
        var _a;
                (_a = node.render) === null || _a === void 0 ? void 0 : _a.events.dispatch(GraphEventTypes.AddRunLog, { node: node, msg: msg });
    }
    /**
     * @description 添加一个游离子图
     */
    registerExternalGraph(id, name, data) {
        this.externalGraph[id] = {
            id, name, data,
        };
    }
    /**
     * @description:
     * @param {IVector2} position
     * @return {boolean}
     */
    isInSubgraph(position) {
        var _a;
        const nodes = this.getNodes();
        if (!nodes.length)
            return false;
        const viewer = (_a = nodes[0].viewer) === null || _a === void 0 ? void 0 : _a.rootDom;
        const realPos = { x: position.x + viewer.getOffsetLeft(), y: position.y + viewer.getOffsetTop() };
        for (let i = 0; i < nodes.length; i++) {
            const item = nodes[i];
            if (item.subGraph) {
                const graph = item.widgets[0];
                const rect = graph.viewerDom.getBoundingClientRect();
                if (realPos.x > rect.x && realPos.x < rect.x + rect.width
                    && realPos.y > rect.y && realPos.y < rect.y + rect.height) {
                    return true;
                }
            }
        }
        return false;
    }
    getAllSubGraph() {
        const nodes = this.getNodes();
        if (!nodes.length)
            return [];
        let all = [];
        for (let i = 0; i < nodes.length; i++) {
            const item = nodes[i];
            if (item.subGraph) {
                const graph = item.widgets[0];
                all.push(graph.viewer);
            }
        }
        return all;
    }
    /**
     * 设置延时执行时间
     * @param stepTime
     */
    setStepTime(stepTime) {
        this.stepTime = stepTime;
    }
}
