import { ContextMenuDivider, IContextMenuItem, IKeyValue, INodeRender } from "../../interfaces";
import { INode, INodeOptions, INodeSlot, IVector3, SerNode } from "../interfaces";
import { NodeId, NodeType, SlotTypes, } from "../types";
import { Graph, InputInitOption, Link, NodeInput, NodeOutput, OutputInitOption } from "../graph";
import { customAlphabet } from "nanoid";
import BaseWidget from "../../shared/UI/widgets/BaseWidget";
import { DomNodeRender } from "../../renders";
import { GraphViewer } from "../../viewer";
import { Signals } from "../../event";
import WidgetsManager from "../../shared/UI/widgets/WidgetsManager";
import SelectWidget from '../../shared/UI/widgets/SelectWidget';
import GraphWidget from "../../shared/UI/widgets/GraphWidget";

/**
 * @description 节点类
 */
export class Node implements INode {
  // @mark 动态加入 runMode 属性
  [runMode:string]:any;

  graph: Graph | undefined;
  id: NodeId; //节点id
  index: number = 0; // 节点顺序

  position: IVector3 = { x: 0, y: 0, z: 0 }; //节点位置

  events: Signals;

  public render: INodeRender | null = null;
  public viewer: GraphViewer | undefined

  inputs: Array<NodeInput> = [];
  outputs: Array<NodeOutput> = [];
  properties: IKeyValue = {};
  widgets: Array<BaseWidget> = [];

  addInputsConfig: Array<InputInitOption> = []; //节点能添加的输入配置项
  addOutputsConfig: Array<OutputInitOption> = []; //节点能添加的输出配置项

  childrenNode:Array<Node> = [];

  private _subGraph: Graph | null = null;

  set subGraph(v: Graph | null) {
    this.setSubGraph(v);
  }

  get subGraph() {
    return this._subGraph;
  }

  // 是否事件节点（异步节点），运行到此会暂停等待，需手动执行run
  isEvent: boolean = false;

  options: INodeOptions = {}

  get type() { // 节点类型
    // @ts-ignore
    return this.constructor.NodeType;
  }

  get label() { // 节点显示名
    return this.getLabel();
  }

  // @ts-ignore
  _label: string = this.constructor.NodeLabel;

  get associativeNode() {//关联节点
    // @ts-ignore
    return this.constructor.AssociativeNode;
  }

  static NodeType: NodeType = "Node"; //节点类型
  static NodeLabel: string = "基础"; //节点显示名
  static NodePath: string = ""; //节点添加的路径
  static AssociativeNode: Array<string> = [];//关联节点
  static NotAddContextMenu: boolean = false; //不添加到右键菜单中的创建节点中

  /**
   * @description 创建节点的id
   * @returns
   */
  static createId(): NodeId {
    //const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 6);
    const nanoid = customAlphabet('0123456789', 10);
    return `node_${nanoid()}`;
  }

  constructor(

  ) {
    // this.graph = graph;
    // this.position = position;
    // this.properties = properties;
    // this.options = options;
    this.id = Node.createId();

    this.events = new Signals;


  }

  public _initOptions(graph: Graph,
    position: IVector3,
    properties: IKeyValue = {},
    options: INodeOptions = {}) {
    this.graph = graph
    this.position = position
    // this.properties = properties
    for(let key in properties){
      this.setProperty(key,properties[key])
    }
    // this.options = options
    for(let key in options){
      this.setOption(key,options[key])
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
  getSlotIndex(slot: INodeSlot): number {
    let slots: Array<INodeSlot> = [];

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
  initEvents(): void {
  }

  /**
   * @description: 所有依赖值都被准备好了触发，事件节点的前置方法，非事件节点可以与beforeExecute等效
   */
  onTrigger(): void {
  }

  /**
   * @description 渲染初始化完成
   */
  initedRender(): void {
  }

  /**
   * @description 获取input
   * @param index
   * @returns
   */
  getInput(index: number): NodeInput | null {
    return this.inputs[index];
  }

  /**
   * @description 获取所有输入
   */
  getInputs(): Array<NodeInput> {
    return this.inputs;
  }

  /**
   * @description 获取所有输出
   */
  getOutputs(): Array<NodeOutput> {
    return this.outputs;
  }

  /**
   * @description: 获取输入值
   * @param {number} index
   */
  getInputData(index: number): any {
    let inp = this.getInput(index);

    if (inp) {
      if (!inp?.link && inp.allow_input) {
        return inp.value
      }
      return inp.link?.origin.value;
    }
    return null;
  }

  /**
   * @description: 设置输出值
   * @param {number} index
   * @param {any} value
   */
  setOutputData(index: number, value: any, refresh: boolean = false): void {
    let out = this.getOutput(index);
    if (out) {
      out.value = value;
      if (refresh) {
        this.render?.outputs[index].refresh();
      }
    }

  }

  /**
   * @description: 节点主方法执行之前
   */
  beforeExecute(): void {
  }

  /**
   * @description: 事件节点的对外统一的调用方法，仅事件节点调用
   * @description: 普通节点不需要从这儿走
   */
  invoke(): void {
    this.graph!.nodeRunning(this, this);
  }

  /**
   * @description: 节点执行主方法
   * @param {INode} eventNode
   */
  run(eventNode: INode | null = null): void {
    if (this.viewer){
      this.viewer.events.dispatch('NodeBeforeExecute', this)
    }
    this.beforeExecute();
    this.onExecute();
    // 修改节点状态运行

    this.afterExecute();
    if (this.viewer){
      this.viewer.events.dispatch('NodeAfterExecute', this)
    }
    // next
    // this.doNext(eventNode);
  }

  /**
   * @description: 执行下一个节点的运行
   * @param {INode} eventNode
   */
  doNext(eventNode: INode | null = null): void {
    this.outputs.forEach(output => {
      output.link.forEach((link) => {
        this.graph!.nodeRunning(link.targetNode, eventNode);
      })
    });
  }

  /**
   * @description: 执行之后
   */
  afterExecute(): void {
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
  getOutput(index: number): NodeOutput | null {
    return this.outputs[index];
  }

  /**
   * @description 添加一个插槽到node
   * @param slot
   */
  addSlot(slot: NodeInput | NodeOutput) {
    if (slot.node !== this) slot.node = this;

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
  addInput(options: InputInitOption) {
    let input = NodeInput.create(this, options);
    this.render?.refresh();
    return input;
  }

  /**
   * @description 添加一个输出插槽
   * @param {OutputInitOption} options
   */
  addOutput(options: OutputInitOption) {
    const output = NodeOutput.create(this, options);
    this.render?.refresh();
    return output;
  }

  /**
   * @description 克隆一个节点
   * @returns
   */
  clone(): Node {
    const node = this.graph!.createNode(
      this.type,
      this.position,
      Object.assign({}, this.properties),
    );

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
  serialize(): SerNode {
    const inps = [];
    const outs = [];
    const options: IKeyValue = {};

    const position: [
      number,
      number,
      number
    ] = [
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
    options['clientWidth'] = this.render?.root.getClientWidth();
    // @ts-ignore
    options['clientHeight'] = this.render?.root.getClientHeight();

    if (this.options['addInput']) options['addInput'] = true;
    if (this.options['addOutput']) options['addOutput'] = true;
    if (this.options['nodeColor']) options['nodeColor'] = this.options['nodeColor'];
    if (this.options['nodeTitleColor']) options['nodeTitleColor'] = this.options['nodeTitleColor'];
    if (this.options['nodeFontColor']) options['nodeFontColor'] = this.options['nodeFontColor'];


    const res: SerNode = {
      id: this.id,
      type: this.type,
      index: this.index,
      _label: this._label,
      position,
      inputs: inps,
      outputs: outs,
      properties: Object.assign({}, this.properties),
      options,
    }

    if (this.subGraph) {
      res['subGraph'] = this.subGraph.serialize();
    }

    return res;
  }

  /**
   * @description 节点内部的序列化用于重载
   * @param data
   */
  deserialize(data: SerNode) {
  }

  /**
   * @description 设置位置
   */
  setPosition(pos: IVector3) {
    this.position = pos;
  }

  /**
   * @description 获取所有与这个node相连的link
   */
  getAllLinks(): Array<Link> {
    let links: Array<Link> = [];

    for (let inp of this.inputs) {
      if (!inp.link) continue;
      links.push(inp.link);
    }

    for (let out of this.outputs) {
      links = links.concat(out.link);
    }

    return links
  }

  /**
   * @description 获取可以添加的输入
   * @override
   * @returns
   */
  getAddInputs(): Array<InputInitOption> {
    return [];
  }

  /**
   * @description 获取可以添加的输出
   * @override
   * @returns
   */
  getAddOutputs(): Array<OutputInitOption> {
    return [];
  }

  /**
   * @description 设置自定义属性
   */
  setProperty(key: string, value: any) {
    this.properties[key] = value;
    // 自定义属性变化 触发绑定的widget实际
    this.widgets.forEach((widget) => {
      // if (widget.onPropertyChanged) {
      //   widget.onPropertyChanged(key, value);
      // }
      if(widget.propertyName == key){
        if (widget instanceof SelectWidget){
          value = [value]
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
  setInitProperty(key: string, value: any) {
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
  getProperty(key: string) {
    return this.properties[key];
  }

  /**
   * @description 获取设置项
   * @param key
   */
  getOption(key: string) {
    return this.options[key];
  }

  /**
   * @description 设置设置项
   * @param key
   */
  setOption(key: string, value: any) {
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
      this._label = this.constructor.NodeLabel
    }
    return this._label;
  }

  setLabel(value: string) {
    this._label = value;
  }

  /**
   * @description 当节点发生高亮的时候
   */
  onNodeHighLight() {
  }

  // =========== widget about ===============
  addWidget(name: string, option?: any, label?: string,propertyName?:string): BaseWidget | null {
    let w: BaseWidget | null = null;
    if(this.runMode){
      if(name == GraphWidget.widgetType){
        option.rumMode = this.runMode
        w = WidgetsManager.createWidget(name, option)
      }else{
        w = WidgetsManager.createWidget('input',this.options)
      }
    }else{
      w = WidgetsManager.createWidget(name, option)
    }
    if (!w) return null;
    if (label) {
      w.label = label
    }
    if(propertyName){
      w.propertyName = propertyName
      w.onChange((value) => {
        if (w instanceof SelectWidget){
          value = value[0];
        }
        this.properties[propertyName] = value
      })
    }
    this.widgets.push(w);

    setTimeout(() => {
      this.render?.refresh();
    }, 0);
    return w;
  }

  getWidgetIndex(widget: BaseWidget) {
    for (let i = 0; i < this.widgets.length; i++) {
      if (this.widgets[i] === widget) {
        return i;
      }
    }
    return -1;
  }

  getWidget(index: number): BaseWidget | null {
    let w = this.widgets[index]
    if (!w) return null
    return w;
  }

  setWidget(index: number, widget: BaseWidget) {
    this.widgets[index] = widget
  }

  removeWidget(index: number) {
    let w = this.getWidget(index);
    if (w) {
      w.remove();
      this.widgets.splice(index, 1)
    }
  }

  renderInit(render: DomNodeRender) {

  }

  setRender(r: INodeRender|null) {
    this.render = r;
    this.renderInit(r as DomNodeRender);
  }

  setSubGraph(v: Graph | null) {
    if (!v) return;
    this._subGraph = v;
    v.parentNode = this;
  }

  getContextMenu(): Array<IContextMenuItem | ContextMenuDivider> {
    return [];
  }

  /**
   * @description 被删除时
   */
  onRemove(): void {
  }

  setViewer(v: GraphViewer) {
    this.viewer = v;
  }

  /**
   * @description: 当刷新时，此时一般dom已经重建完毕，可以操作dom进行修改
   */
  onRefresh?(): void;
}
