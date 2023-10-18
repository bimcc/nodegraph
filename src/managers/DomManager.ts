/*
 * @Date: 2023-07-13 14:46:54
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-10-09 15:24:04
 * @FilePath: /graph/src/managers/DomManager.ts
 */
import { IInputRender, IKeyType, INodeManager, INodeRender, IOutputRender } from "../interfaces";
import { INode, IVector2, Node, NodeId } from '../core';
import { GraphEventTypes, RenderTypes } from "../types";
import { GraphEvents } from "../viewer";
import { DomNodeRender } from '../renders';
import { NativeDiv } from '../shared/UI/NativeDiv';



/**
 * @description 管理dom渲染的管理器
 */
export class DomManager implements INodeManager {
  // 接口属性
  type: RenderTypes = RenderTypes.Dom;
  rootDom: NativeDiv;
  events: GraphEvents;

  // 私有属性
  private nodeMap: IKeyType<INodeRender> = {}; //渲染的节点
  public root: NativeDiv;

  constructor(rootDom: NativeDiv, events: GraphEvents) {
    this.rootDom = rootDom;
    this.events = events;

    this.root = new NativeDiv();
    this.root.setStyle({
      transformOrigin:"top left",
    })
    this.root.setPosition('absolute', 0, 0,);

    this.rootDom.add(this.root);
  }

  /**
   * @description 获取全部渲染节点
   */
  getAllNodes(): Array<INodeRender> {
    return Object.values(this.nodeMap);
  }

  /**
   * @description 渲染一个node
   * @param node 
   * @returns 
   */
  addNode(node: Node): INodeRender {
    if (this.nodeMap[node.id]) return this.nodeMap[node.id];//可能已经渲染过了

    const rNode = new DomNodeRender(this.root, node, this.events.viewPosition, this.events);

    this.nodeMap[node.id] = rNode;

    return rNode
  }

  /**
   * @description 删除节点
   * @param id 
   */
  removeNode(id: NodeId) {
    if (!this.nodeMap[id]) return;

    this.nodeMap[id].remove();
    delete this.nodeMap[id];
  }

  /**
   * @description 获取节点的渲染器
   * @param id 
   */
  getNodeRender(id: NodeId): null | INodeRender {
    return this.nodeMap[id];
  }

  /**
   * @description 获取插槽渲染器
   * @param id 
   * @param index 
   * @param isOutput 
   */
  getSlotRender(id: NodeId, index: number, isOutput: boolean): null | IInputRender | IOutputRender {
    const rNode = this.getNodeRender(id);
    if (!rNode) return null;

    if (isOutput) {
      return rNode.getOutput(index);
    } else {
      return rNode.getInput(index);
    }
  }

  /**
   * @description 刷新所有node显示
   */
  refresh() {
    this.nodeMap
    for (let id in this.nodeMap) {
      const rNode = this.nodeMap[id];
      rNode.refresh();
    }
  }

  setPosition(): void {
    const realScale = this.events.getScale(true)
    // 偏移量应该使用当前graph的相对缩放
    const originScale = this.events.getScale()
    this.root.setStyle({
      transform: `scale(${realScale}) translate(${this.events.viewPosition.x / originScale}px,${this.events.viewPosition.y / originScale}px)`
    })

    let all = this.events.viewer.graph.getAllSubGraph()
    if(all.length){
      all.forEach(item => {
        item.getNodeManager().setPosition()
      })
    }
  }
}