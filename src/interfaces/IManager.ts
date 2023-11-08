/*
 * @Date: 2023-07-13 14:44:04
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-11-07 16:19:47
 * @FilePath: /bimcc-graph/src/interfaces/IManager.ts
 */
import { Graph, INodeInput, INodeOutput, IVector2, Link, LinkId, Node, NodeId, NodeType } from '../core';
import { NativeDiv } from '../shared';
import { RenderTypes } from '../types';
import { GraphEvents, GraphViewer } from '../viewer';
import { IFunction, IKeyValue } from './IBase';
import { IInputRender, ILinkRender, INodeRender, IOutputRender } from './IRender';

export interface IManager {
  type: RenderTypes;
  rootDom: NativeDiv;
  events: GraphEvents;
}

/**
 * @description 节点管理器
 */
export interface INodeManager extends IManager {
  root: NativeDiv,
  addNode: (node: Node) => INodeRender|null, // 渲染一个节点
  removeNode: (id: NodeId) => void, // 删除一个节点
  getNodeRender: (id: NodeId) => null | INodeRender, //获取节点渲染
  getSlotRender: (id: NodeId, index: number, isOutput: boolean) => null | IInputRender | IOutputRender, //获取插槽渲染
  refresh: () => void, //刷新所有node显示
  getAllNodes: () => Array<INodeRender>, //获取全部节点
  setPosition: () => void
}

/**
 * @description 连线管理器
 */
export interface ILinkManager extends IManager {
  addLink: (link: Link, start: IOutputRender, end: IInputRender) => void,
  removeLink: (id: LinkId) => void,
  getLinkRender: (id: LinkId) => ILinkRender | null,
  displayTempLine: (value: boolean) => void,// 显示隐藏临时线段
  setTempLine: (start: IVector2, end: IVector2, isDragEnd: boolean) => void,// 设置临时线段的显示
  clear: () => void
  refresh: () => void, //刷新所有link显示
}

export interface ILinkInfo { start: IOutputRender, end: IInputRender, link : Link }

/**
 * @description UI管理器
 */
export interface IUIManager extends IManager {
  openContextMenu: (position: IVector2, menu: Array<IContextMenuItem | ContextMenuDivider>) => void,
  closeContextMenu: () => void,
  openAssociativeMenu: (node: Node, slot: INodeInput | INodeOutput, position: IVector2, typeList: Array<IKeyValue>,) => void,
  closeAssociativeMenu: () => void,
  getContextMenu: (viewer: GraphViewer) => Array<IContextMenuItem | ContextMenuDivider>,
  openNodePanel : ( nr : INodeRender)=>void,
  isShowContextMenu : boolean,
}

/**
 * @description 菜单项列表
 */
export interface IContextMenuItem {
  label: string,
  callback?: IFunction,
  subMenu?: Array<IContextMenuItem | ContextMenuDivider>,
}

// 右键菜单分割线类型
export type ContextMenuDivider = null;