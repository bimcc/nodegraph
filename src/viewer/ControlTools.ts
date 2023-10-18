/*
 * @LastEditors: lisushuang
 * @Description: 启停等控制面板
 * @FilePath: /graph/src/viewer/ControlTools.ts
 * @Date: 2023-07-31 16:03:16
 * @LastEditTime: 2023-09-26 15:40:22
 * @Author: lisushuang
 */

import { Graph, INode } from "../core";
import { IFunction } from "../interfaces";
import { NativeButton, NativeDiv } from "../shared";
import { GraphAction, GraphEventTypes } from "../types";
import { GraphEvents } from "./GraphEvents";

interface controlButton{
  name:string,
  callback:IFunction,
  backgroundColor?:string,
  color?:string
}

class ControlTools extends NativeDiv {

  graph: Graph

  logPanel: ConsolePanel | null = null

  events: GraphEvents

  constructor(graph: Graph, events: GraphEvents) {
    super();
    this.graph = graph;
    this.events = events

    this.initBox();

    this.initButtons();

    this.events.add(GraphEventTypes.AddRunLog, (log: { node: INode, msg: string }) => {
      this.logPanel?.log(log)
    })

  }

  initBox() {
    this.setStyle({
      position: "absolute",
      top: "10px",
      right: "10px",
      display: "flex",
      flexDirection: "row",
      background: "black",
      opacity: "0.8",
      height: "30px",
      padding: "8px",
      borderRadius: "10px",
      cursor: "pointer",
      justifyContent: "center",
      alignItems: "center"
    })

    this.DOM.addEventListener("dblclick", (e:MouseEvent) => {
      e.stopPropagation();
    })
  }

  initButtons() {
    let start = new StartButton();
    start.setMarginRight("10px")
    start.onClick(() => {
      if (!this.logPanel) {
        this.logPanel = new ConsolePanel();
        this.add(this.logPanel);
      }

      this.graph.start();
    })
    this.add(start)

    this.events.add(GraphAction.StartRun,() => {
      start.DOM.click();
    })

    let end = new EndButton();
    end.onClick(() => {
      this.logPanel?.remove();
      this.logPanel = null;
      start.stopAnimation();
      this.graph.stop();
      setTimeout(() => {
        this.graph.stop();
      }, this.graph.stepTime);
    })


    this.events.add(GraphAction.StopRun,() => {
      end.DOM.click();
    })
    this.add(end);
  }

  /**
   * @description: 添加一个控制按钮
   * @param {controlButton} button
   */  
  addButton(button:controlButton){
    if(!button.name || !button.callback){
      console.error("无效的按钮")
      return ;
    }
    let bt = new NativeButton(button.name)
    bt.onClick(() => {
      button.callback()
    })

    bt.setMarginLeft("10px")

    if(button.backgroundColor){
      bt.setBackgroundColor(button.backgroundColor)
    }

    if(button.color){
      bt.setColor(button.color)
    }

    this.add(bt)
  }
}

class StartButton extends NativeDiv {

  isAnimating: boolean = false;
  animationFrameId: number = 0;
  scale: number = 1;
  scaleFactor: number = 0.01;
  maxScale: number = 1.2;
  minScale: number = 0.8;

  constructor() {
    super();

    this.DOM.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">\
        <circle cx="12" cy="12" r="11" stroke="white" stroke-width="2" />\
        <polygon points="10,7 18,12 10,17" fill="white" />\
      </svg>'

    this.setHeight(24);

    this.onClick(() => {
      this.startAnimation();
    })
  }

  // 开始动画
  startAnimation() {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;
    this.animateScale();
  }

  // 停止动画
  stopAnimation() {
    if (!this.isAnimating) {
      return;
    }
    this.isAnimating = false;
    cancelAnimationFrame(this.animationFrameId);
    this.scale = 1;
    this.updateScale();
  }

  // 缓慢缩放动画
  animateScale() {
    if (!this.isAnimating) {
      return;
    }

    this.scale += this.scaleFactor;
    if (this.scale >= this.maxScale || this.scale <= this.minScale) {
      this.scaleFactor = -this.scaleFactor; // 反转缩放方向
    }

    this.updateScale();

    // 使用 requestAnimationFrame 递归调用动画函数，实现连续的缩放动画效果
    this.animationFrameId = requestAnimationFrame(() => {
      this.animateScale();
    });
  }

  // 更新元素的缩放比例
  updateScale() {
    this.DOM.style.transform = `scale(${this.scale})`;
  }
}

class EndButton extends NativeDiv {
  constructor() {
    super()

    this.setHeight(24)
    this.DOM.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">\
    <circle cx="12" cy="12" r="11" stroke="white" stroke-width="2" />\
    <rect x="8" y="8" width="8" height="8" stroke="white" stroke-width="2" />\
  </svg>'
  }
}

// 运行日志面板
class ConsolePanel extends NativeDiv {

  logs: Array<{ node: INode, msg: string }> = [];

  constructor() {
    super();

    this.initBox();

    this.render();
  }

  initBox() {
    this.setStyle({
      position: "absolute",
      left: "-20px",
      background: "black",
      height: "20px",
      width: "20px",
      top: "0",
      borderRadius: "6px",
      padding: "6px",
      overflowY: "auto",
      opacity: ".8",
      transition: "all 0.5s ease"
    })
    setTimeout(() => {
      this.setWidth("200px")
        .setLeft("-220px")
        .setHeight("200px")
    }, 0);

    this.onWheel((e: WheelEvent) => {
      e.stopPropagation()
    })
  }

  log(log: { node: INode, msg: string }) {
    this.logs.unshift(log);
    this.render();
  }

  private render() {
    this.clear();

    this.logs.forEach(item => {
      this.createLogItem(item);
    })
  }

  override remove(): void {
    // this.clear();
    this.setLeft("0px")
      .setTop(5)
      .setWidth("24px")
      .setHeight("24px")
    setTimeout(() => {
      this.clear();
    }, 300);
    setTimeout(() => {
      super.remove();
    }, 500);
  }

  createLogItem(item: { node: INode, msg: string }) {
    let content = new NativeDiv();
    content.DOM.innerHTML = `节点${item.node.id} [${item.node.label}]：${item.msg}`
    content.setStyle({
      color: "white",
      fontSize: "12px",
      padding: "2px",
      borderBottom: "1px solid white",
      borderRadius: "4px",
      cursor: "pointer",
      userSelect:"none",
      webkitUserSelect:"none"
    })

    content.onMouseover(() => {
      content.setStyle({
        background: "white",
        color: "black"
      })
    })

    content.DOM.addEventListener("dblclick", (e: MouseEvent) => {
      e.stopPropagation();
    })

    content.onMouseout(() => {
      content.setStyle({
        background: "black",
        color: "white"
      })
    })

    content.onClick(() => {
      item.node.render?.events.dispatch(GraphAction.FocusOnNode,item.node.id)
      item.node.render?.shake()
    })
    this.add(content);
  }

}

export default ControlTools;