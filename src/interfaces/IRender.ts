/*
 * @Date: 2023-07-13 14:07:44
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-09-07 14:54:52
 * @FilePath: /graph/src/interfaces/IRender.ts
 */
import { IVector2, Link, Node, NodeInput, NodeOutput, } from '../core';
import { Signals } from '../event';
import { NativeDiv } from '../shared';
import { GraphEvents } from '../viewer/GraphEvents';
import { ContextMenuDivider, IContextMenuItem, ILinkInfo } from './IManager';

/**
 * @description 渲染器接口
 */
interface IRender {
}


interface ISlotRender {
  isVerticalMode : boolean, //是否是垂直模式
  linkInfo : ILinkInfo | null, // 连接状态
  setLinked: (value: boolean) => void,//设置连接状态样式
  getWidth: () => number, //获取宽度
  getPosition: () => IVector2,//获取插槽位置
  refresh: () => void,//刷新显示
  getContextMenu : ()=> Array<IContextMenuItem | ContextMenuDivider>, //获取点击节点的菜单项
  onNodeInited : ()=>void,// 节点渲染完成时

  remove: ()=>void,
}


export interface IInputRender extends ISlotRender {
  slot: NodeInput,

}
export interface IOutputRender extends ISlotRender {
  slot: NodeOutput,
}

/**
 * @description 渲染node节点的接口
 */
export interface INodeRender extends IRender {
  events:GraphEvents,

  node: Node,
  inputs: Array<IInputRender>,
  outputs: Array<IOutputRender>,
  renderEvents : Signals,
  widgetsBox: NativeDiv,

  getContent : ()=> any, // 获取渲染内容的
  refresh: () => void, //根据数据刷新节点显示
  setSize: (w: number, h: number) => void,//设置宽高
  setPosition: (x: number, y: number) => void, //设置位置
  adaption: () => void, // 将node设置成最合适的宽高
  getInput: (index: number) => IInputRender,
  getOutput: (index: number) => IOutputRender,
  getPosition: () => IVector2, //获取位置
  remove: () => void,//删除
  setHighLight: (color?:string) => void, // 高亮
  cancelHighLight: () => void, // 取消高亮
  getContextMenu : ()=> Array<IContextMenuItem | ContextMenuDivider>, //获取点击节点的菜单项
  setLabel : ( value : string )=>void,//设置label
  shake:() => void, // 抖动
  removeNode : ()=>void,//删除自身节点
}


export interface ILinkRender extends IRender {
  link: Link,

  refresh: () => void, //刷新显示
  remove: () => void, //销毁自身
}
