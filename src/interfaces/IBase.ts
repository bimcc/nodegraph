/*
 * @Date: 2023-06-16 15:05:17
 * @LastEditors: asahi
 * @LastEditTime: 2023-06-26 17:46:25
 * @FilePath: \litegraph\src\interfaces\IBase.ts
 */

/**
 * Key value object
 */
export interface IKeyValue {
    [key: string]: any;
  }
  
/**
 * - 自定义键类型
 * - Custom type of key
 */
export interface IKeyType<T> {
    [ key: string ]: T;
}

export interface IEnumType<T> {
    [ key : number ] : T;
}

/**
 * @description 不定参和返回值的函数类型
 */
export type IFunction = ( ... arg : Array<any> ) => any;

/**
 * @description 表示颜色的字符串
 */
export type ColorString = string;