
import { LinkId, NodeId, } from '../types';
import { INodeSlot, ISerializeObject, DataTypeStr, } from '../interfaces';


/**
 * @description 序列化后的连接
 */
export type SerLink = [ 
    LinkId,  // link id
    NodeId,  // 起始节点id
    number,  // 插槽位置
    NodeId,  // 结束节点id
    number,  // 插槽位置
    DataTypeStr, // 传值类型
];

/**
 * @description 连接接口
 */
export interface ILink extends ISerializeObject {
    id : LinkId, // 连接的Id
    index : number, // 连接顺序值
    origin : INodeSlot, // 连接的起点节点插槽
    target : INodeSlot, // 连接的终点节点插槽
    valueType : DataTypeStr, // 连接传输的数据类型
}
