import ControlTools from "../viewer/ControlTools";
import MiniMap from "../viewer/MiniMap";
import SearchBox from "../viewer/SearchBox";

export interface IViewerTools {
    control?: ControlTools,
    searchBox?: SearchBox,
    miniMap?: MiniMap,
}

/**
 * @description Viewer参数配置
 */
export interface IViewerOptions {
    controlShow?: boolean, // 是否显示控制面板
    searchBoxShow?: boolean, // 是否显示搜索框
    miniMapShow?: boolean, // 是否显示小地图
    nodeIndexShow:boolean // 节点序号是否显示
    readonly?:boolean, // 只读模式
    [key: string]: any, // 自定义设置
}