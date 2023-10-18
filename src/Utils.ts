/*
 * @Date: 2023-06-15 17:29:37
 * @LastEditors: asahi
 * @LastEditTime: 2023-09-21 14:16:49
 * @FilePath: \litegraph\src\Utils.ts
 */

import { AABB, INode, IVector2, IVector3 } from "./core";
import { Node } from './core';
import { INodeRender } from "./interfaces";

/**
 * @description 判断是否是Undefined
 * @param value 
 * @returns 
 */
export const IsUndefined = ( value : any ) => {
    return value === undefined;
}

/**
 * @description 判断是否是null
 * @param value 
 * @returns 
 */
export const IsNull = ( value : any ) =>{
    return value === null;
}

/**
 * @description 判断点位是否在box中
 * @param position 
 * @param box 
 * @returns 
 */
export const isInBox = ( position : IVector3, box : AABB) => {
    return box.min.x < position.x && box.max.x > position.x && box.min.y < position.y && box.max.y > position.y
}

/**
 * @description 归一化一个二维向量 x^2 + y^2 = L^2
 * @param param0 
 * @returns 
 */
export const normalizeVertor2 = ({ x,y } : IVector2)=>{
    return {
        x : x / Math.sqrt((Math.pow(x,2) + Math.pow(y,2))),
        y : y / Math.sqrt((Math.pow(x,2) + Math.pow(y,2))),
    }
}

/**
 * @description 获取一个二维向量的垂直向量 ax+by=0
 */
export const getVerticalVector2 = ( { x, y } : IVector2 ) =>{
    let a = 0;
    let b = 0;
    if( y !== 0 ){
        a = 1;// 设这个垂直向量x=1;
        b = -x / y;
    }else{
        b = 1;
        a = -y / x;
    }

    return normalizeVertor2({
        x : a,
        y : b,
    })
}

/**
 * @description: 给定一个值，返回其类型
 * @param {any} value 值
 * @return {string}
 */
export const getValueType = (value: any): string =>  {
    return Object.prototype.toString.apply(value);
}

/**
 * @description: 给定一个值，判断是否为数字
 * @param {any} value 值
 * @return {boolean}
 */
export const isNumber = (value?: any): value is number => {
    return getValueType(value) === '[object Number]';
}

/**
   * @description: 给定一个值，判断是否已定义
   * @param {T} value 值
   * @return {boolean}
   */
export const isDefine = <T>(value?: T | void): value is T => {
    return value !== undefined && value !== null;
}

/**
 * @description 等待
 * @param t 
 * @returns 
 */
export const wait = ( t = 100)=>{
    return new Promise<void>(( rol )=>{
        setTimeout(()=>{
            rol();
        }, t)
    })
}

/**
 * @description 添加css
 * @param cssStr 
 */
export const AppendCss = ( cssStr : string )=>{
    const head = document.getElementsByTagName('head')[0];

    const style = document.createElement('style');
    style.innerHTML = cssStr;    

    head.appendChild(style);
}

/**
 * @description 获取节点数组中的头部节点
 */
export const getHeaderNode = ( nodes : Array<INodeRender> ) :  Array<INodeRender> => {
    const roots :  Array<INodeRender> = [];
    const _nodes : Array<Node> = [];

    for(let nr of nodes){
        _nodes.push(nr.node);
    }

    for(let nr of nodes){
        const node = nr.node;
        let isRoot = true;

        for(let input of node.inputs){
            if(!input.link) continue;
            if(_nodes.indexOf(input.link.originNode) === -1) continue; 
            
            isRoot = false;
            break;
        }

        if(isRoot) roots.push(nr);
    }

    return roots;
}

/**
 * @description 获取节点数组中的尾部节点
 * @param nodes 
 * @returns 
 */
export const getTailNode = ( nodes : Array<INodeRender> ) :  Array<INodeRender> => {
    const roots :  Array<INodeRender> = [];
    const _nodes : Array<Node> = [];

    for(let nr of nodes){
        _nodes.push(nr.node);
    }

    for(let nr of nodes){
        const node = nr.node;
        let isTail = true;

        for(let output of node.outputs){
            for(let link of output.link){
                if( _nodes.indexOf(link.targetNode) !== -1){
                    isTail = false;
                    break;
                }
            }

            if(!isTail) break;
        }

        if(isTail) roots.push(nr);
    }

    return roots;
}

/**
 * @description 是否是连续连接的节点
 */
export const isContinuousNodes = ( nodes : Array<INodeRender>)=>{
    if(nodes.length === 1 ) return false;

    //input和output连线有一个在数组中
    for(let nr of nodes){
        let isContinuous = false;

        const node = nr.node;
        for(let output of node.outputs){
            for(let link of output.link){
                if(nodes.indexOf(link.targetNode.render as INodeRender) !== -1){
                    isContinuous = true;
                    break;
                }

                if(isContinuous) break;
            }

            if(isContinuous) break;
        }

        if(isContinuous ) continue;

        for(let input of node.inputs){
            if(input.link){
                if(nodes.indexOf(input.link.originNode.render as INodeRender) !== -1){
                    isContinuous = true;
                    break;
                }
            }

            if(isContinuous) break;
        }

        if(!isContinuous) return false;
    }

    return true;
}   