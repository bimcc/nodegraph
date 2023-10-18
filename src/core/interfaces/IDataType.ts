/*
 * @Date: 2023-06-14 09:40:18
 * @LastEditors: asahi
 * @LastEditTime: 2023-08-16 17:03:54
 * @FilePath: \litegraph\src\core\interfaces\IDataType.ts
 */


/**
 * @description 数据传递代表类型字符串
 */
export type DataTypeStr = string;

/**
 * @description 触发事件的数据类型
 */
export const EventDataTypeStr = "_EventType";

/**
 * @description 通用数据类型
 */
export const AnyDataTypeStr = "any";

/**
 * @description 数据类型配置
 */
export interface DataTypeOptions {
    id : DataTypeStr, // 类型字符串自身
    label : string, // 显示名称
}