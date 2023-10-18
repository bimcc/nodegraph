import { LinkId, SlotTypes, } from "../types";
import { DataTypeStr, ISerializeObject, ILink, INode,} from "../interfaces";
import {IFunction, IKeyValue} from '../../interfaces';

/**
 * @description 序列化后的输入插槽结构
 */
export interface SerNodeInput {
    type : SlotTypes.INPUT,
    label : string,
    link : LinkId | null,
    valueType : Array< DataTypeStr >,
    options : IKeyValue,
    defaultValue : any,
    allow_input : boolean,
    inputWidgetType?: string,
    value :any
}

/**
 * @description 序列化后的输出插槽结构
 */
export interface SerNodeOutput {
    type : SlotTypes.OUTPUT,
    label : string,
    link : Array<LinkId>,
    valueType : DataTypeStr ,
    options : IKeyValue,
    defaultValue : any,
}

/**
 * @description 插槽的设置
 */
export interface INodeSlotOptions {
    remove ?: boolean, // 是否可以删除
    removeFunc?:IFunction,
    rename ?: boolean, // 是否可以重命名
    isVertical ?: boolean, //是否是垂直状态显示
}

/**
 * @description 蓝图插槽
 */
export interface INodeSlot extends ISerializeObject {
    index : number, // 插槽位置
    label : string, // 插槽显示名称
    type : SlotTypes, // 插槽类型
    node : INode, // 所属节点
    valueType : Array<DataTypeStr> | DataTypeStr, // 插槽传输数据的类型
    link : null | ILink | Array<ILink>, // 插槽连接线
    options : INodeSlotOptions, // 插槽设置
    defaultValue : any, // 默认值
    allow_input?: boolean,
    value?:any
}

/**
 * @description 输入插槽接口
 */
export interface INodeInput extends INodeSlot {
    type : SlotTypes.INPUT,
    valueType : Array< DataTypeStr >, //接受传入类型可能有多种
    link : null | ILink,
}

/**
 * @description 输出插槽接口
 */
export interface INodeOutput extends INodeSlot {
    type : SlotTypes.OUTPUT,
    link : Array< ILink >,
    valueType : DataTypeStr, //传出值的类型是只能是一种
    value : any, // 输出插槽的输出值
}