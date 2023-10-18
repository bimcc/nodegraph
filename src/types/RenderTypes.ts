/*
 * @Date: 2023-06-16 15:43:28
 * @LastEditors: asahi
 * @LastEditTime: 2023-08-02 16:09:34
 * @FilePath: \litegraph\src\types\RenderTypes.ts
 */

/**
 * @description 需要渲染的内容枚举
 */
export enum RenderTargetTypes {
    Node = 'RenderNode', // 节点
    Link = 'RenderLink', // 连接
    UI   = 'RenderUI',   // UI
}


/**
 * @description 渲染器类型
 */
export enum RenderTypes {
    Dom = 'DomRender', //dom渲染器
    Svg = 'SvgRender', //svg渲染器
    DomUI = 'DomUIRender',
}
