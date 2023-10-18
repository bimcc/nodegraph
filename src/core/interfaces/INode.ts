/*
 * @Date: 2023-06-14 09:24:45
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-10-07 15:23:47
 * @FilePath: /graph/src/core/interfaces/INode.ts
 */
import { IKeyValue, INodeRender, } from '../../interfaces';
import { NodeId, NodeType, } from "../types"; 
import { ISerializeObject, IVector3, INodeInput, INodeOutput, SerNodeInput, SerNodeOutput, SerGraph, } from "../interfaces";
import { Graph } from '../graph';

/**
 * @description 蓝图节点接口
 */
export interface INode extends ISerializeObject{
    id : NodeId,// 节点的id
    type : NodeType, // 节点的类型
    label : string, // 节点的显示名称
    index : number, // 创建节点的顺序值
    position : IVector3, //节点位置    
    inputs : Array< INodeInput >, // 输入插槽
    outputs : Array< INodeOutput >, // 输出插槽
    isEvent:boolean, // 是否事件节点
    
    properties : IKeyValue , // 节点属性
    render: INodeRender|null,
    run:(eventNode:INode|null) => void, // 节点内容执行
    onTrigger(): void, // 依赖值已准备完毕
    _initOptions(graph: Graph,position: IVector3,properties: IKeyValue,options: INodeOptions):void
}

/**
 * @description 序列化后的node结构
 */
export interface SerNode {
    id : NodeId,
    type : NodeType,
    index : number,
    _label : string,
    position : [
        number, //x
        number, //y
        number, //z
    ],
    inputs : Array< SerNodeInput >,
    outputs : Array< SerNodeOutput >,
    properties : IKeyValue,
    options : IKeyValue,
    subGraph ?: SerGraph,
    subGraphSlotIndex ?: number,
    subGraphSlotNodeId ?: NodeId,
}


/**
 * @description 节点参数配置
 */
export interface INodeOptions {
    addInput ?: boolean, // 是否可以添加输入插槽
    addOutput ?: boolean, // 是否可以添加输出插槽
    notClone ?: boolean, // 是否不可以克隆
    notResize ?: boolean, // 是否不可以拖动改变大小
    [ key : string ] : any, // 自定义设置
}