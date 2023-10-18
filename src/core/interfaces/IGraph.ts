/*
 * @Date: 2023-06-15 18:06:13
 * @LastEditors: asahi
 * @LastEditTime: 2023-08-21 14:23:58
 * @FilePath: \litegraph\src\core\interfaces\IGraph.ts
 */
import { Graph } from "../graph";
import { SerLink, SerNode} from "../interfaces";


/**
 * @description 序列化后的节点和连接数据
 */
export interface SerNodeData {
    nodes : Array<SerNode>,
    links : Array<SerLink>,
}

/**
 * @description 序列化后的蓝图数据结构
 */
export interface SerGraph extends SerNodeData{
    version : string,// 版本号
}

/**
 * @description 游离子图
 */
export interface ExternalGraph {
    id : string ,//游离子图id
    name : string, //游离子图名字
    data : SerGraph, //游离子图对象
}