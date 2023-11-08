import {IKeyType, IKeyValue,} from '../../interfaces';
import {Graph, Link, Node, NodeInput, NodeOutput,} from '../graph';
import {AnyDataTypeStr, INodeOptions, ISerializeObject, IVector3, SerLink, SerNode, SerNodeData} from "../interfaces";
import {LinkId, NodeId, NodeType, SlotTypes} from '../types';
import * as NnodeTypes from "./nodes";
import {NSubGraph} from './nodes';
import Alert from '../../shared/UI/Alert';
import {config} from '../../config';

/**
 * @description 节点管理类
 */
export class NodeManager implements ISerializeObject {

  nodeIndex: number = -1; // 创建的node计数器
  nodeMap: IKeyType<Node> = {}; // 节点map
  static nodeTypeMap: { [key: NodeType]: any } = {}; //记录已经注册的Node类型

  linkMap: IKeyType<Link> = {}; //连接map
  linkIndex: number = -1; //创建link的计数器
  undefinedType: string = '_undefined'; //没有注册的class类型
  graph: Graph; // 蓝图实例

  constructor(graph: Graph) {
    this.graph = graph;

    this.initDefaultNode();
  }

  /**
   * @description 初始化默认的节点
   */
  initDefaultNode() {
    const list: any = NnodeTypes;
    for (const key in list) {
      if (list[key].NotAutoRegister) continue;
      this.register(list[key]);
    }
  }

  /**
   * @description 注册一个节点类
   * @param { Node } nodeClass 继承node的类
   */
  register(nodeClass: any) {
    if (!(nodeClass.prototype instanceof Node)) return;
    if (NodeManager.nodeTypeMap[nodeClass.NodeType]) return;
    NodeManager.nodeTypeMap[nodeClass.NodeType] = nodeClass;
  }

  /**
   * @description 创建node并添加Node
   * @param type
   * @param position
   * @returns
   */
  createNode(type: NodeType, position: IVector3 = {x: 0, y: 0, z: 0}, properties: IKeyValue = {}, options: INodeOptions = {}) {
    if (!NodeManager.nodeTypeMap[type]) return;
    const nClass = NodeManager.nodeTypeMap[type];
    nClass.prototype.viewer = this.graph.viewer
    const node = new nClass();
    node._initOptions(this.graph, position, properties, options)

    // @mark 随机颜色
    if (!node.options.nodeColor && config.createRandomStyleNode) {
      let color = config.getRandomColor()
      node.setOption('nodeColor', color.nodeColor)
      node.setOption('nodeFontColor', color.nodeFontColor)
      node.setOption('nodeTitleColor', color.nodeTitleColor)
    }

    this.addNode(node);

    return node;
  }

  /**
   * @description 添加一个node
   * @param node
   */
  addNode(node: Node) {
    if (this.nodeMap[node.id]) return;
    this.nodeMap[node.id] = node;
    this.nodeIndex += 1;
    node.index = this.nodeIndex;
  }


  /**
   * @description 获取node
   * @param id
   */
  getNode(id: NodeId): Node | null {
    return this.nodeMap[id];
  }

  /**
   * @description 获取所有node
   * @returns
   */
  getNodes() {
    return Object.values(this.nodeMap);
  }

  /**
   * @description 重设节点状态
   */
  reset() {
    this.nodeMap = {};
    this.linkMap = {};
    this.nodeIndex = -1;
    this.linkIndex = -1;
  }

  /**
   * @description 删除节点
   * @param id
   */
  removeNode(id: NodeId) {
    if (!this.nodeMap[id]) return;
    const node = this.nodeMap[id];

    for (let lid in this.linkMap) {
      const link = this.linkMap[lid];

      if (link.originNode === node || link.targetNode === node) {
        this.removeLink(link);
      }
    }

    node.onRemove();
    delete this.nodeMap[id];
  }

  /**
   * @description 通过Node来添加连接
   * @param originNode 连接起点节点
   * @param targetNode 连接终点节点
   * @param originIndex slot index
   * @param targetIndex slot index
   * @param force 强制连接,如果输入已经连接了其他内容强制连接就会删除原来连接的线.默认true
   */
  addLink(originNode: Node, originIndex: number = 0, targetNode: Node, targetIndex: number = 0, force = true): Link | null {
    if (originNode === targetNode) return null;

    const output: NodeOutput | null = originNode.getOutput(originIndex);
    const input: NodeInput | null = targetNode.getInput(targetIndex);

    if (!output || !input) {
      console.warn(`连接失败 输入或输出不存在 输出[${originNode.id}:${originIndex}] 输入[${targetNode.id}:${targetIndex}] `);
      return null;
    }

    return this.addLinkBySolt(output, input, force);
  }

  /**
   * @description 获取所以link
   */
  getLinks() {
    return Object.values(this.linkMap);
  }

  /**
   * @description 根据slot添加连接
   * @param { NodeOutput } origin
   * @param { NodeInput } target
   */
  addLinkBySolt(output: NodeOutput, input: NodeInput, force = true): Link | null {
    if (!this.canLink(output, input, force)) return null;

    //强制连接且已经连线了
    if (force && input.link) {
      this.removeLink(input.link);
    }

    const link = Link.create(output, input);
    this.linkIndex += 1;
    link.index = this.linkIndex
    this.linkMap[link.id] = link;
    return link;
  }

  /**
   * @description 判断两个slot是否能够连接
   * @param output
   * @param input
   */
  canLink(output: NodeOutput, input: NodeInput, force = true) {
    if (output.type !== SlotTypes.OUTPUT || input.type !== SlotTypes.INPUT) {
      console.warn(`连接失败 参数错误`)
      return false;
    }

    // 数据类型不一样
    if (input.valueType.indexOf(output.valueType) === -1) {
      //且输入输出没有any类型
      if (input.valueType.indexOf(AnyDataTypeStr) === -1 && output.valueType !== AnyDataTypeStr) {
        let msg = `连接失败 输入[${input.node.id}:${input.index}]接受类型为[${input.valueType.join(',')}] 连接类型为[${output.node.id}:${output.index}]->${output.valueType}`
        console.warn(msg)
        let alertMsg = `【类型不匹配】[ ${output.valueType} ] => 连接至 => [ ${input.valueType.join(',')} ]`
        Alert.warning(alertMsg)
        return false;
      }
    }
    // 自己连接自己
    if (input.node === output.node) {
      console.warn(`连接失败 不允许自身连接 [${input.node.id}]`)
      return false;
    }


    //todo 环状连接检查

    // 不是强制连接情况下已经有连线在终点了
    if (!force) {
      if (input.link) {
        console.warn(`连接失败 非强制连接模式已有连线`)
        return false;
      }
    }

    return true;
  }

  /**
   * @description 根据id删除连线
   * @param id
   */
  removeLinkById(id: LinkId) {
    if (!this.linkMap[id]) return;
    this.removeLink(this.linkMap[id]);
  }

  /**
   * @description 删除连线
   * @param link
   */
  removeLink(link: Link) {
    const output: NodeOutput = link.origin;
    const input: NodeInput = link.target;
    if (input.link !== link || !output.hasLink(link)) return;

    input.deleteLink();
    output.deleteLink(link);
    delete this.linkMap[link.id];
  }

  /**
   * @description 获取按照创建顺序的node节点数组
   */
  getNodeList() {
    const list = Object.values(this.nodeMap);

    return list.sort((i0: Node, i1: Node) => {
      return i0.index - i1.index;
    });
  }

  /**
   * @description 获取按照创建顺序的Link数组
   */
  getLinkList() {
    const list = Object.values(this.linkMap);

    return list.sort((i0: Link, i1: Link) => {
      return i0.index - i1.index;
    });
  }

  /**
   * @description 序列化节点管理
   */
  serialize(): SerNodeData {
    const data: SerNodeData = {
      nodes: [],
      links: [],
    };

    for (const node of this.getNodeList()) {
      data.nodes.push(node.serialize());
    }

    for (const link of this.getLinkList()) {
      data.links.push(link.serialize());
    }

    return data;
  }

  /**
   * @description 反序列化节点信息
   * @param {SerNodeData} 序列化信息
   */
  deserialize({nodes, links}: SerNodeData) {
    this.reset();

    const afterNodeSerFun = [];// 在全部反序列完成之后调用节点的deserialize来实现各自特殊的反序列化

    for (let serNode of nodes) {
      afterNodeSerFun.push(this.deserializeNode(serNode));
    }

    //节点创建完成后
    for (let fun of afterNodeSerFun) {
      fun();
    }

    for (let serlink of links) {
      this.deserializeLink(serlink);
    }

  }

  /**
   * @description 反序列化连接
   * @param param0
   */
  private deserializeLink([linkId, originId, originIndex, targetId, targetIndex,]: SerLink) {
    if (!this.nodeMap[originId] || !this.nodeMap[targetId]) return console.warn(`连接反序列失败 [${originId}]-[${targetId}],无此节点`);

    const output: Node = this.nodeMap[originId];
    const input: Node = this.nodeMap[targetId];

    if (!this.addLink(output, originIndex, input, targetIndex)) return console.warn(`连接反序列失败 [${originId}]-[${targetId}]`);
  }

  /**
   * @description 反序列化节点
   */
  public deserializeNode(serData: SerNode) {
    // @mark 动态加入 runMode 属性
    Node.prototype.runMode = this.graph.viewer?.runMode

    const {id, type, position, inputs, outputs, properties, options, subGraph, index, _label} = serData;
    let nClass = NodeManager.nodeTypeMap[type];
    if (!nClass) {
      // 反序列化的节点类型并未注册
      console.warn(`节点类型:[${type}],并未注册`);
      nClass = Node;
    }
    const node = new nClass();

    node._initOptions(this.graph, {
      x: position[0],
      y: position[1],
      z: position[2] ?? 0,
    }, properties, options)

    node.id = id;
    node._label = _label;

    const inps: Array<NodeInput> = [];
    const outs: Array<NodeOutput> = [];

    inputs.forEach((inp, index) => {
      // 节点 输入插槽配置
      if (node?.inputOptions && node?.inputOptions[index]) {
        inp = Object.assign(inp, node.inputOptions[index])
      }
      inps.push(NodeInput.deserialize(node, inp, false));
    })

    for (let out of outputs) {
      outs.push(NodeOutput.deserialize(node, out, false));
    }

    node.inputs = inps;
    node.outputs = outs;

    this.addNode(node);

    if (!!index) {
      if (index < this.nodeIndex) {
        node.index = this.nodeIndex;
      } else {
        node.index = index;
      }
    }

    if (this.nodeIndex < index) {
      this.nodeIndex = index + 1;
    }

    if (subGraph) {
      //先有子图的node 再创建子图的graph 
      const subNode = node as NSubGraph;
      const sg = new Graph();
      // 先给子图graph设置parentNode 
      node.setSubGraph(sg);
      // 序列化子图graph
      sg.deserialize(subGraph);
      // 刷新子图显示
      subNode.refreshViewer();
    }

    return () => {
      node.deserialize(serData)
    }
  }

  /**
   * @description 获取节点类型
   */
  getNodeTypeList(): Array<{ label: string, type: NodeType }> {
    const list: Array<{ label: string, type: NodeType }> = [];

    for (let type in NodeManager.nodeTypeMap) {
      const nClass = NodeManager.nodeTypeMap[type];

      if (['subGraphInput', 'subGraphOutput'].indexOf(type) > -1) {
        continue;
      }
      list.push({
        label: nClass.NodeLabel,
        type,
      })
    }

    return list;
  }

  /**
   * @description 获取节点类信息
   * @returns
   */
  getNodeClassInfo() {
    const map: IKeyType<{ type: string, path: string, label: string, associativeNode: Array<NodeType>, notAddContextMenu: boolean }> = {}
    for (let type in NodeManager.nodeTypeMap) {
      const nClass = NodeManager.nodeTypeMap[type];
      map[nClass.NodeType] = {
        type: nClass.NodeType as string,
        path: nClass.NodePath as string,
        label: nClass.NodeLabel as string,
        associativeNode: nClass.AssociativeNode as Array<NodeType>,
        notAddContextMenu: nClass.NotAddContextMenu as boolean,
      }
    }

    return map;
  }

  /**
   * @description 删除连接
   * @param slot
   */
  removeSlot(slot: NodeInput | NodeOutput) {
    const node = slot.node
    if (slot.type === SlotTypes.INPUT) {
      if (slot.link) {
        this.removeLinkById(slot.link.id);
      }
      node.inputs.splice(slot.index, 1);
    } else {
      if (slot.link.length > 0) {
        for (let lk of slot.link) {
          this.removeLinkById(lk.id);
        }
      }
      node.outputs.splice(slot.index, 1);
    }
  }

  /**
   * 递归获取子节点
   * @param parentNode 父节点对象
   */
  getChildrenNodes(parentNode: Node) {
    let childNodes: any[] = []
    parentNode.getOutputs().forEach(output => {
      output.link.forEach(link => {
        let childNode = link.target.node;
        this.getChildrenNodes(childNode)
        childNodes.push(childNode)
      })
    })
    parentNode.childrenNode = childNodes;
    return parentNode;
  }
}
