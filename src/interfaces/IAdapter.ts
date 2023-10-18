/*
 * @Date: 2023-06-27 16:23:15
 * @LastEditors: asahi
 * @LastEditTime: 2023-08-17 14:56:02
 * @FilePath: \litegraph\src\interfaces\IAdapter.ts
 */

import { Graph, SerGraph } from "../core";
import { IKeyValue } from "./IBase";

/**
 * @description 声明适配器类型
 */
export type AdapterType = string;

/**
 * @description 适配器接口
 */
export interface IAdapter {
    type : AdapterType, //适配器类型
}

/**
 * @description 数据适配接口
 */
export interface IDataAdapter extends IAdapter{
    toData : ( data : SerGraph  ) =>  any, // 当前蓝图数据转换成所适配类型数据
    fromData : ( data : any ) => SerGraph, // 所适配类型数据转换成当前蓝图数据
}

/**
 * @description 前版蓝图输入结构
 */
export interface PrevGraphInputData{
    name : string,
    type : string | number,
    link : number | null,
    label ?: string,
    allow_input: boolean,
    value: any
}

/**
 * @description 前版蓝图输出结构
 */
export interface PrevGraphOutputData{
    name : string,
    type : string | number,
    links : Array<number>,
    slot_index ?: number,
}

/**
 * @description 前版蓝图节点结构
 */
export interface PrevGraphNodeData {
    id : number,
    type : string,
    pos : {
        [ index : number ] : number,
    },
    size ?: [number,number],
    flags : {
        [ key : string ] : any,
    },
    order : number,
    mode : number,
    inputs : Array< PrevGraphInputData >,
    outputs : Array< PrevGraphOutputData >,
    properties : IKeyValue,
    subgraph ?: PrevGraphData,
    options?:IKeyValue,
    color?: string,
    bgcolor?: string,
    title?:string,
}

/**
 * @description 前版蓝图连线结构
 */
export type PrevGraphLinkData = [number,number,number,number,number,string];

/**
 * @description 前版蓝图整体结构
 */
export interface PrevGraphData {
    last_node_id : number,
    last_link_id : number,
    nodes : Array< PrevGraphNodeData >,
    links : Array< PrevGraphLinkData >,
    groups : Array< any >,
    config : IKeyValue,
    extra : IKeyValue,
    version : number,
}
