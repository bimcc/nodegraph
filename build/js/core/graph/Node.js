import { SlotTypes, } from "../types";
import { NodeInput, NodeOutput } from "../graph";
import { customAlphabet } from "nanoid";
import { Signals } from "../../event";
import WidgetsManager from "../../shared/UI/widgets/WidgetsManager";
import SelectWidget from '../../shared/UI/widgets/SelectWidget';
import GraphWidget from "../../shared/UI/widgets/GraphWidget";
/**
 * @description 节点类
 */
export class Node {
    set subGraph(v) {
        this.setSubGraph(v);
    }
    get subGraph() {
        return this._subGraph;
    }
    get type() {
        // @ts-ignore
        return this.constructor.NodeType;
    }
    get label() {
        return this.getLabel();
    }
    get associativeNode() {
        // @ts-ignore
        return this.constructor.AssociativeNode;
    }
    /**
     * @description 创建节点的id
     * @returns
     */
    static createId() {
        //const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 6);
        const nanoid = customAlphabet('0123456789', 10);
        return `node_${nanoid()}`;
    }
    constructor() {
        Object.defineProperty(this, "graph", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); //节点id
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // 节点顺序
        Object.defineProperty(this, "position", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { x: 0, y: 0, z: 0 }
        }); //节点位置
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "render", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "viewer", {
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
        Object.defineProperty(this, "properties", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "widgets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "addInputsConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        }); //节点能添加的输入配置项
        Object.defineProperty(this, "addOutputsConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        }); //节点能添加的输出配置项
        Object.defineProperty(this, "childrenNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_subGraph", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // 是否事件节点（异步节点），运行到此会暂停等待，需手动执行run
        Object.defineProperty(this, "isEvent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        // @ts-ignore
        Object.defineProperty(this, "_label", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.constructor.NodeLabel
        });
        // this.graph = graph;
        // this.position = position;
        // this.properties = properties;
        // this.options = options;
        this.id = Node.createId();
        this.events = new Signals;
    }
    _initOptions(graph, position, properties = {}, options = {}) {
        this.graph = graph;
        this.position = position;
        // this.properties = properties
        for (let key in properties) {
            this.setProperty(key, properties[key]);
        }
        // this.options = options
        for (let key in options) {
            this.setOption(key, options[key]);
        }
        if (this.isEvent) {
            this.initEvents();
        }
    }
    /**
     * @description 获取槽插位置
     * @param slot
     * @returns 如果不是属于这个node就返回-1
     */
    getSlotIndex(slot) {
        let slots = [];
        switch (slot.type) {
            case SlotTypes.INPUT:
                slots = this.inputs;
                break;
            case SlotTypes.OUTPUT:
                slots = this.outputs;
                break;
        }
        return slots.indexOf(slot);
    }
    /**
     * @description: 事件节点的初始化钩子，非事件节点无效
     */
    initEvents() {
    }
    /**
     * @description: 所有依赖值都被准备好了触发，事件节点的前置方法，非事件节点可以与beforeExecute等效
     */
    onTrigger() {
    }
    /**
     * @description 渲染初始化完成
     */
    initedRender() {
    }
    /**
     * @description 获取input
     * @param index
     * @returns
     */
    getInput(index) {
        return this.inputs[index];
    }
    /**
     * @description 获取所有输入
     */
    getInputs() {
        return this.inputs;
    }
    /**
     * @description 获取所有输出
     */
    getOutputs() {
        return this.outputs;
    }
    /**
     * @description: 获取输入值
     * @param {number} index
     */
    getInputData(index) {
        var _a;
        let inp = this.getInput(index);
        if (inp) {
            if (!(inp === null || inp === void 0 ? void 0 : inp.link) && inp.allow_input) {
                return inp.value;
            }
            return (_a = inp.link) === null || _a === void 0 ? void 0 : _a.origin.value;
        }
        return null;
    }
    /**
     * @description: 设置输出值
     * @param {number} index
     * @param {any} value
     */
    setOutputData(index, value, refresh = false) {
        var _a;
        let out = this.getOutput(index);
        if (out) {
            out.value = value;
            if (refresh) {
                (_a = this.render) === null || _a === void 0 ? void 0 : _a.outputs[index].refresh();
            }
        }
    }
    /**
     * @description: 节点主方法执行之前
     */
    beforeExecute() {
    }
    /**
     * @description: 事件节点的对外统一的调用方法，仅事件节点调用
     * @description: 普通节点不需要从这儿走
     */
    invoke() {
        this.graph.nodeRunning(this, this);
    }
    /**
     * @description: 节点执行主方法
     * @param {INode} eventNode
     */
    run(eventNode = null) {
        if (this.viewer) {
            this.viewer.events.dispatch('NodeBeforeExecute', this);
        }
        this.beforeExecute();
        this.onExecute();
        // 修改节点状态运行
        this.afterExecute();
        if (this.viewer) {
            this.viewer.events.dispatch('NodeAfterExecute', this);
        }
        // next
        // this.doNext(eventNode);
    }
    /**
     * @description: 执行下一个节点的运行
     * @param {INode} eventNode
     */
    doNext(eventNode = null) {
        this.outputs.forEach(output => {
            output.link.forEach((link) => {
                this.graph.nodeRunning(link.targetNode, eventNode);
            });
        });
    }
    /**
     * @description: 执行之后
     */
    afterExecute() {
    }
    /**
     * @description: 执行函数
     */
    onExecute() {
    }
    /**
     * @description 获取output
     * @param index
     * @returns
     */
    getOutput(index) {
        return this.outputs[index];
    }
    /**
     * @description 添加一个插槽到node
     * @param slot
     */
    addSlot(slot) {
        if (slot.node !== this)
            slot.node = this;
        switch (slot.type) {
            case SlotTypes.INPUT:
                this.inputs.push(slot);
                break;
            case SlotTypes.OUTPUT:
                this.outputs.push(slot);
                break;
        }
    }
    /**
     * @description 添加一个输入插槽
     * @param {InputInitOption} options
     */
    addInput(options) {
        var _a;
        let input = NodeInput.create(this, options);
        (_a = this.render) === null || _a === void 0 ? void 0 : _a.refresh();
        return input;
    }
    /**
     * @description 添加一个输出插槽
     * @param {OutputInitOption} options
     */
    addOutput(options) {
        var _a;
        const output = NodeOutput.create(this, options);
        (_a = this.render) === null || _a === void 0 ? void 0 : _a.refresh();
        return output;
    }
    /**
     * @description 克隆一个节点
     * @returns
     */
    clone() {
        const node = this.graph.createNode(this.type, this.position, Object.assign({}, this.properties));
        for (let inp of this.inputs) {
            inp.clone(node);
        }
        for (let out of this.outputs) {
            out.clone(node);
        }
        return node;
    }
    /**
     * @description 序列化一个节点
     */
    serialize() {
        var _a, _b;
        const inps = [];
        const outs = [];
        const options = {};
        const position = [
            this.position.x,
            this.position.y,
            this.position.z,
        ];
        for (let input of this.inputs) {
            inps.push(input.serialize());
        }
        for (let output of this.outputs) {
            outs.push(output.serialize());
        }
        // @ts-ignore
        options['clientWidth'] = (_a = this.render) === null || _a === void 0 ? void 0 : _a.root.getClientWidth();
        // @ts-ignore
        options['clientHeight'] = (_b = this.render) === null || _b === void 0 ? void 0 : _b.root.getClientHeight();
        if (this.options['addInput'])
            options['addInput'] = true;
        if (this.options['addOutput'])
            options['addOutput'] = true;
        if (this.options['nodeColor'])
            options['nodeColor'] = this.options['nodeColor'];
        if (this.options['nodeTitleColor'])
            options['nodeTitleColor'] = this.options['nodeTitleColor'];
        if (this.options['nodeFontColor'])
            options['nodeFontColor'] = this.options['nodeFontColor'];
        const res = {
            id: this.id,
            type: this.type,
            index: this.index,
            _label: this._label,
            position,
            inputs: inps,
            outputs: outs,
            properties: Object.assign({}, this.properties),
            options,
        };
        if (this.subGraph) {
            res['subGraph'] = this.subGraph.serialize();
        }
        return res;
    }
    /**
     * @description 节点内部的序列化用于重载
     * @param data
     */
    deserialize(data) {
    }
    /**
     * @description 设置位置
     */
    setPosition(pos) {
        this.position = pos;
    }
    /**
     * @description 获取所有与这个node相连的link
     */
    getAllLinks() {
        let links = [];
        for (let inp of this.inputs) {
            if (!inp.link)
                continue;
            links.push(inp.link);
        }
        for (let out of this.outputs) {
            links = links.concat(out.link);
        }
        return links;
    }
    /**
     * @description 获取可以添加的输入
     * @override
     * @returns
     */
    getAddInputs() {
        return [];
    }
    /**
     * @description 获取可以添加的输出
     * @override
     * @returns
     */
    getAddOutputs() {
        return [];
    }
    /**
     * @description 设置自定义属性
     */
    setProperty(key, value) {
        this.properties[key] = value;
        // 自定义属性变化 触发绑定的widget实际
        this.widgets.forEach((widget) => {
            // if (widget.onPropertyChanged) {
            //   widget.onPropertyChanged(key, value);
            // }
            if (widget.propertyName == key) {
                if (widget instanceof SelectWidget) {
                    value = [value];
                }
                widget.setValue(value);
            }
        });
    }
    /**
     * @description 设置节点初始自定义属性
     * @param key 属性名
     * @param value 属性值
     */
    setInitProperty(key, value) {
        // 判断自定义属性是否已存在
        if (this.properties[key] === undefined) {
            this.properties[key] = value;
        }
    }
    /**
     * @description 获取自定义属性
     * @param key
     * @returns
     */
    getProperty(key) {
        return this.properties[key];
    }
    /**
     * @description 获取设置项
     * @param key
     */
    getOption(key) {
        return this.options[key];
    }
    /**
     * @description 设置设置项
     * @param key
     */
    setOption(key, value) {
        this.options[key] = value;
    }
    /**
     * @description 获取显示值方法可重写
     * @override
     * @returns
     */
    getLabel() {
        if (!this._label) {
            //@ts-ignore
            this._label = this.constructor.NodeLabel;
        }
        return this._label;
    }
    setLabel(value) {
        this._label = value;
    }
    /**
     * @description 当节点发生高亮的时候
     */
    onNodeHighLight() {
    }
    // =========== widget about ===============
    addWidget(name, option, label, propertyName) {
        let w = null;
        if (this.runMode) {
            if (name == GraphWidget.widgetType) {
                option.rumMode = this.runMode;
                w = WidgetsManager.createWidget(name, option);
            }
            else {
                w = WidgetsManager.createWidget('input', this.options);
            }
        }
        else {
            w = WidgetsManager.createWidget(name, option);
        }
        if (!w)
            return null;
        if (label) {
            w.label = label;
        }
        if (propertyName) {
            w.propertyName = propertyName;
            w.onChange((value) => {
                if (w instanceof SelectWidget) {
                    value = value[0];
                }
                this.properties[propertyName] = value;
            });
        }
        this.widgets.push(w);
        setTimeout(() => {
            var _a;
            (_a = this.render) === null || _a === void 0 ? void 0 : _a.refresh();
        }, 0);
        return w;
    }
    getWidgetIndex(widget) {
        for (let i = 0; i < this.widgets.length; i++) {
            if (this.widgets[i] === widget) {
                return i;
            }
        }
        return -1;
    }
    getWidget(index) {
        let w = this.widgets[index];
        if (!w)
            return null;
        return w;
    }
    setWidget(index, widget) {
        this.widgets[index] = widget;
    }
    removeWidget(index) {
        let w = this.getWidget(index);
        if (w) {
            w.remove();
            this.widgets.splice(index, 1);
        }
    }
    renderInit(render) {
    }
    setRender(r) {
        this.render = r;
        this.renderInit(r);
    }
    setSubGraph(v) {
        if (!v)
            return;
        this._subGraph = v;
        v.parentNode = this;
    }
    getContextMenu() {
        return [];
    }
    /**
     * @description 被删除时
     */
    onRemove() {
    }
    setViewer(v) {
        this.viewer = v;
    }
}
Object.defineProperty(Node, "NodeType", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Node"
}); //节点类型
Object.defineProperty(Node, "NodeLabel", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "基础"
}); //节点显示名
Object.defineProperty(Node, "NodePath", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ""
}); //节点添加的路径
Object.defineProperty(Node, "AssociativeNode", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: []
}); //关联节点
Object.defineProperty(Node, "NotAddContextMenu", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
}); //不添加到右键菜单中的创建节点中
