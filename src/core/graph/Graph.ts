/*
 * @Date: 2023-06-15 09:26:16
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-11-07 16:36:17
 * @FilePath: /bimcc-graph/src/core/graph/Graph.ts
 */
import {GraphAction, GraphEventTypes, NodeEvents} from "../../types";
import {DataTypeMananger, NodeManager, Node, NodeInput} from '../graph';
import {EventDataTypeStr, ExternalGraph, INode, ISerializeObject, IVector2, SerGraph} from "../interfaces";
import {config} from '../../config';
import {nanoid} from "nanoid";
import {IKeyType} from "../../interfaces";
import GraphWidget from "../../shared/UI/widgets/GraphWidget";
import {GraphViewer} from "../../viewer";

/**
 * @description 蓝图基类
 */
export class Graph implements ISerializeObject {

  subGraphType = 'subGraph';
  subGraphInputType = 'subGraphInput';
  subGraphOutputType = 'subGraphOutput';

  /**
   * @description 子图父节点是一个Node 子图的input和output来自于这个Node
   */
  parentNode: Node | null = null;

  viewer:GraphViewer|null = null;

  /**
   * @description 作为子图时的输入
   */
  get inputs() {
    if (!this.parentNode) return null;
    return this.parentNode.inputs;
  }

  /**
   * @description 作为子图时的输出
   */
  get outputs() {
    if (!this.parentNode) return null;
    return this.parentNode.outputs;
  }


  id: string;
  version: string = '1.00';// 版本号 
  nodeManager: NodeManager;

  // 游离子图对象
  externalGraph: IKeyType<ExternalGraph> = {};

  // 运行状态
  runningStatus: "stop" | "running" | "pause" = "stop";

  // 暂停等待的节点数组，事件或者异步节点
  pauseNodes: Array<INode> = [];

  eventRuns: { [key: string]: Array<INode> } = {}

  // 已经运行的节点
  runedNodes: Array<INode> = [];

  // 执行的延迟器
  runtimers: Array<number> = [];

  // 步骤间隔时间 ms
  stepTime: number = 500;

  waitNodes: Array<INode> = [];

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
    this.id = `graph-${nanoid(6)}`;
    DataTypeMananger.get();
    this.nodeManager = new NodeManager(this);
  }

  /**
   * @description 序列化蓝图
   */
  serialize(): SerGraph {
    const nodeData = this.nodeManager.serialize();
    return Object.assign({
      version: this.version,
    }, nodeData);
  }

  /**
   * @description 反序列化蓝图
   */
  deserialize({nodes, links,}: SerGraph) {
    this.nodeManager.deserialize({nodes, links,});
  }

  /**
   * @description: 开始运行
   */
  start() {
    if (this.runningStatus == "running") return;
    this.runningStatus = "running"
    // 所有的Node
    let nodes = this.getNodes();
    // 找到没有输入的Node
    let startNode: Array<INode> = [];
    nodes.forEach(node => {
      // 没有inputs的节点
      if (node.inputs.length == 0) {
        startNode.push(node)
        return;
      }

      // 有inputs 但全都没连线
      let hasInputLink = false;
      node.inputs.forEach(input => {
        if (input.link) {
          hasInputLink = true;
        }
      })
      if (!hasInputLink) {
        startNode.push(node)
      }
    })


    // 按节点离第一个节点的绝对距离排序
    let startAndDistance: Array<{ node: INode, dis: number }> = [];

    if (startNode.length) {
      startNode.forEach((item, index) => {
        if (index == 0) {
          startAndDistance.push({node: item, dis: 0})
        } else {
          let x = item.position.x - startNode[0].position.x
          let y = item.position.y - startNode[0].position.y
          let dis = Math.sqrt(x * x + y * y)
          startAndDistance.push({node: item, dis})
        }
      });
    }

    // 按距离近远排序
    startAndDistance.sort((a, b) => {
      return a.dis - b.dis
    })

    startAndDistance.forEach((item, index) => {
      startNode[index] = item.node
    })

    // startNode.forEach((node, index) => {
    //   let timer = setTimeout(() => {
    //     if (this.runningStatus == "running") {
    //       this.nodeRunning(node);
    //     }
    //   }, this.stepTime * index);
    //   this.runtimers.push(timer);
    // });
    this.waitNodes = startNode;

    this.runByStep()
  }

  checkNodeRuned(node: INode, eventNode: INode | null = null): boolean {
    if (eventNode && this.eventRuns[eventNode.id]) {
      for (let i = 0; i < this.eventRuns[eventNode.id].length; i++) {
        const n = this.eventRuns[eventNode.id][i];
        if (n.id == node.id) {
          return true;
        }
      }
    } else {
      for (let i = 0; i < this.runedNodes.length; i++) {
        const n = this.runedNodes[i];
        if (n.id == node.id) {
          return true;
        }
      }
    }
    return false;
  }

  private runByStep(eventNode: INode | null = null) {
    let nowNode = this.waitNodes.shift();
    if (!nowNode) return;
    // 当前就是事件节点自己，清空运行状态
    if (eventNode && nowNode.id == eventNode.id && this.eventRuns[eventNode.id] && this.eventRuns[eventNode.id].length) {
      this.eventRuns[eventNode.id].forEach(node => {
        node.render?.cancelHighLight();
        this.runedNodes = this.runedNodes.filter((value) => {
          return value.id !== node.id
        })
      })
      this.eventRuns[eventNode.id] = []
    }
    if (this.checkIfCanRun(nowNode, eventNode)) {
      // 聚焦到节点
      nowNode.render?.events.dispatch(GraphAction.FocusOnNode, nowNode.id);
      // 节点执行
      this.realRun(nowNode, eventNode);
      nowNode.outputs.forEach(output => {
        if (output.link && output.link.length) {
          output.link.forEach(link => {
            if (link.target.node) {
              this.waitNodes.unshift(link.target.node)
            }
          })
        }
      })
    } else {
      // 没运行的说明在等待依赖值
      if (!this.checkNodeRuned(nowNode, eventNode)) {
        nowNode.render?.events.dispatch(GraphAction.FocusOnNode, nowNode.id);
        nowNode.render?.setHighLight(config.style.NodeHighLightColor)
        nowNode.render?.shake()
      }
    }
    setTimeout(() => {
      this.runByStep(eventNode)
    }, this.stepTime);
  }

  /**
   * @description: 检查该节点是否能够被执行
   * @param {INode} node 检查的节点
   * @param {INode} eventNode 本次事件触发的节点
   * @return {boolean}
   */
  checkIfCanRun(node: INode, eventNode: INode | null = null): boolean {
    if (this.runningStatus !== "running") return false;
    // 无事件标识，且已经被运行过
    if (this.checkNodeRuned(node) && !eventNode) return false;
    if (eventNode && this.checkNodeRuned(node, eventNode)) return false;
    // 查看所有的input是否已经准备好
    // 先判断inputs节点是否已经被执行
    let prepared = true;
    // 找到起始节点
    for (let index = 0; index < node.inputs.length; index++) {
      const element = node.inputs[index];
      let has = false
      for (let j = 0; j < this.runedNodes.length; j++) {
        const n = this.runedNodes[j];
        if (n.id == element.link?.origin.node.id) {
          has = true;
        }
      }
      if (!has) prepared = false;
      // 未连线，但本身是可填的，如果已连线，则必须等待
      if (!prepared && !element.link && element.allow_input) {
        prepared = true
      }
      // 跳过 trigger input
      if (!prepared && !element.link && element.valueType.indexOf(EventDataTypeStr) > -1) {
        prepared = true
      }

      // @mark 一旦有一个input没有准备好，立马就跳出循环
      if (!prepared) break;
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
          if (eventNode && eventNode!.id == element.id) {
            // 必须要是强制执行的事件才能从这儿走
            this.sendLog(node, "事件【被触发】")
            // 必然是事件
            return true;
          } else {
            return false;
          }
        }
      }
      // 等待节点处理
      this.pauseNodes.push(node);
      // 事件节点仅在等待时才能onTrigger，执行时不需要
      node.onTrigger();
      this.sendLog(node, "事件等待中。。。")
      return false;
    } else {
      this.sendLog(node)
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
  nodeRunning(node: INode, eventNode: INode | null = null): void {
    if (this.runningStatus !== "running") return;
    if (!this.waitNodes.length) {
      this.waitNodes.push(node)
      this.runByStep(eventNode);
    } else {
      this.waitNodes.push(node)
    }
  }

  realRun(node: INode, eventNode: INode | null = null) {
    this.runedNodes.push(node);
    if (eventNode) {
      if (!this.eventRuns[eventNode.id]) {
        this.eventRuns[eventNode.id] = []
      }
      this.eventRuns[eventNode.id].push(node);
    }

    let timer = window.setTimeout(() => {
      node.render?.events.dispatch(GraphEventTypes.LinksFresh, this.runedNodes);
      node.run(eventNode);
      if (eventNode) {
        node.render?.shake();
      }
      node.render?.setHighLight(eventNode ? config.style.NodeEventColor : config.style.NodeRunningColor)
      // 先刷新线，再修改已运行节点

    }, this.stepTime);
    this.runtimers.push(timer)
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
    this.runningStatus = "stop";
    this.waitNodes = []
    this.getNodes().forEach(node => {
      node.render?.cancelHighLight()
    });
    let timer = null;
    while (timer = this.runtimers.shift()) {
      clearTimeout(timer);
    }
    this.runedNodes[0]?.render?.events.dispatch(GraphEventTypes.LinksFresh)
    this.runedNodes = [];
    this.pauseNodes = [];
  }

  sendLog(node: INode, msg: string = "已运行") {
    console.log(`节点${node.id} [${node.label}]：${msg}`)
    node.render?.events.dispatch(GraphEventTypes.AddRunLog, {node: node, msg: msg})
  }

  /**
   * @description 添加一个游离子图
   */
  registerExternalGraph(id: string, name: string, data: SerGraph) {
    this.externalGraph[id] = {
      id, name, data,
    }
  }

  /**
   * @description:
   * @param {IVector2} position
   * @return {boolean}
   */
  isInSubgraph(position: IVector2): boolean {
    const nodes = this.getNodes();
    if (!nodes.length) return false;
    const viewer = nodes[0].viewer?.rootDom!;
    const realPos = {x: position.x + viewer.getOffsetLeft(), y: position.y + viewer.getOffsetTop()}
    for (let i = 0; i < nodes.length; i++) {
      const item = nodes[i];
      if (item.subGraph) {
        const graph = item.widgets[0] as GraphWidget
        const rect = graph.viewerDom.getBoundingClientRect()
        if (realPos.x > rect.x && realPos.x < rect.x + rect.width
          && realPos.y > rect.y && realPos.y < rect.y + rect.height
        ) {
          return true;
        }
      }
    }
    return false;
  }

  getAllSubGraph(): Array<GraphViewer> {
    const nodes = this.getNodes();
    if (!nodes.length) return [];
    let all = []
    for (let i = 0; i < nodes.length; i++) {
      const item = nodes[i];
      if (item.subGraph) {
        const graph = item.widgets[0] as GraphWidget
        all.push(graph.viewer)
      }
    }
    return all;
  }

  /**
   * 设置延时执行时间
   * @param stepTime
   */
  setStepTime(stepTime: number) {
    this.stepTime = stepTime;
  }
}