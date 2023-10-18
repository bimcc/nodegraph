/*
 * @Date: 2023-06-16 15:43:28
 * @LastEditors: asahi
 * @LastEditTime: 2023-08-02 16:09:34
 * @FilePath: \litegraph\src\types\RenderTypes.ts
 */
/**
 * @description 需要渲染的内容枚举
 */
export var RenderTargetTypes;
(function (RenderTargetTypes) {
    RenderTargetTypes["Node"] = "RenderNode";
    RenderTargetTypes["Link"] = "RenderLink";
    RenderTargetTypes["UI"] = "RenderUI";
})(RenderTargetTypes || (RenderTargetTypes = {}));
/**
 * @description 渲染器类型
 */
export var RenderTypes;
(function (RenderTypes) {
    RenderTypes["Dom"] = "DomRender";
    RenderTypes["Svg"] = "SvgRender";
    RenderTypes["DomUI"] = "DomUIRender";
})(RenderTypes || (RenderTypes = {}));
