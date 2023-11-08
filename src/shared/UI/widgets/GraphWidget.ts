/*
 * @Date: 2023-08-07 16:17:24
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-11-08 15:00:05
 * @FilePath: /bimcc-graph/src/shared/UI/widgets/GraphWidget.ts
 */


import { Graph } from "../../../core";
import { GraphViewer } from "../../../viewer";
import Alert from "../Alert";
import { NativeDiv } from "../NativeDiv";
import BaseWidget from "./BaseWidget";

export interface IWGraphProp {
  graph: Graph,
  rumMode?: boolean,
}

export enum GraphWidgetModes {
  min,
  window,
}

class GraphWidget extends BaseWidget {

  static widgetType = 'graph'

  graph: Graph
  viewer: GraphViewer
  viewerDom: NativeDiv;
  minDom: NativeDiv; //最小化模式
  mode: GraphWidgetModes = GraphWidgetModes.window

  minSize: { w: number, h: number } = {
    w: 400,
    h: 300,
  }

  size: { w: number, h: number } = {
    w: this.minSize.w,
    h: this.minSize.h,
  }
  constructor(option: Partial<IWGraphProp>) {
    super();

    const viewerDom = this.viewerDom = new NativeDiv();
    const minViewerBtn = new NativeDiv();
    viewerDom.setStyle({
      position: "relative",
      top: "0px",
      left: "0px",
    })

    minViewerBtn.setStyle({
      position: 'absolute',
      top: "10px",
      left: "10px",
      width: '26px',
      height: '26px',
      backgroundColor: 'rgb(26 26 26)',
      borderRadius: '5px',
      textAlign: 'center',
      lineHeight: '23px',
      cursor: 'pointer',
      color:"white"
    }).innerText('-')

    minViewerBtn.onClick(() => {
      this.setMode(GraphWidgetModes.min);
    })

    // 展开子图按钮
    const minDom = this.minDom = new NativeDiv();
    // 阻止右键
    minDom.onContextmenu((e: MouseEvent) => {
      e.preventDefault();
    })
    const minBtn = new NativeDiv();
    minDom.setStyle({
      width: '120px',
      height: '30px',
      // padding: '3px',
    });

    minBtn.setStyle({
      width: '100%',
      height: '100%',
      backgroundColor: '#6FA1FF',
      borderRadius: '6px',
      textAlign: 'center',
      lineHeight: '30px',
    });
    minBtn.innerText('展开子图');

    minBtn.onMouseout(() => {
      minBtn.setBackgroundColor('#6FA1FF')
    });

    minBtn.onMouseover(() => {
      minBtn.setBackgroundColor('#409eff')
    });

    minBtn.onClick(() => {
      this.setMode(GraphWidgetModes.window);
    })

    minDom.add(minBtn);
    this.add(minDom);
    this.add(viewerDom);

    this.graph = option.graph ?? new Graph();
    if(option.rumMode){
      this.viewer = new GraphViewer(null, this.graph);
    }else{
      this.viewer = new GraphViewer(viewerDom.DOM, this.graph);
    }
    viewerDom.add(minViewerBtn);

    this.initEventListener();

    this.setMode(this.mode);
  }

  private initEventListener() {
    this.onMousedown((e: MouseEvent) => {
      e.stopPropagation();
    })

    this.onMouseup((e: MouseEvent) => {
      // e.stopPropagation();
    })

    this.onMousemove((e: MouseEvent) => {
      // e.stopPropagation();
    })

    this.onWheel((e) => {
      e.stopPropagation();
    });

    this.onContextmenu((e) => {
      e.stopPropagation();
    })
  }

  setMode(mode: GraphWidgetModes) {
    this.mode = mode;
    switch (mode) {
      case GraphWidgetModes.min:
        if(this.viewerDom.DOM.style.position == "absolute"){
          Alert.warning("子图正处于放大状态，请先退出子图")
          return ;
        }
        this.graph.parentNode?.render?.widgetsBox.setAlignItems("center")
        this.viewerDom.hide();
        this.minDom.show();
        break;
      case GraphWidgetModes.window:
        this.graph.parentNode?.render?.widgetsBox.setAlignItems("inherit")
        this.viewerDom.show();
        this.minDom.hide();
        break;
    }

    this.refreshSize();
    this.onChangeMode(mode);
  }

  refreshSize() {
    switch (this.mode) {
      case GraphWidgetModes.min:
        this.setWidth(this.minDom.getClientWidth());
        this.setHeight(this.minDom.getClientHeight());
        break;
      case GraphWidgetModes.window:
        this.viewerDom.setWidth(this.size.w).setHeight(this.size.h);
        this.setWidth(this.size.w).setHeight(this.size.h);
        break;
    }
  }

  override onChange(closure: (value: any) => void): void {
  }

  override getValue() {
  }

  override setValue(value: any): void {
  }

  onChangeMode(v: GraphWidgetModes) {
  }

  setGraph(g: Graph) {
    this.graph = g;
    this.viewer.graph = g;
    if(this.viewer.tools.control){
      this.viewer.tools.control!.graph = g;
    }
  }

  refresh(...arg: Array<any>) {
    this.viewer.refresh(...arg);
  }

  changeSize(offset: { w: number, h: number }) {
    this.size.w += offset.w;
    this.size.h += offset.h;
    this.refreshSize();
  }
}

export default GraphWidget;
