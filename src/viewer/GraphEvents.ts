/*
 * @Date: 2023-07-13 14:25:10
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-10-08 11:19:52
 * @FilePath: /graph/src/viewer/GraphEvents.ts
 */

import { IVector2 } from "../core";
import { Signal, Signals } from "../event";
import { IGraphMouseEvent, IInputRender, INodeRender, IOutputRender } from "../interfaces";
import { NativeDiv } from "../shared";
import {CustomEvetns, GraphAction, GraphEventTypes, NodeEvents} from "../types";
import { GraphViewer } from "./GraphViewer";

/**
 * @description 鼠标目标类型
 */
export enum MouseTargetTypes {
  None, // 鼠标目标没有
  Node, // 鼠标目标是节点
  Slot, // 鼠标目标时插槽
  Widget,// 鼠标目标是widget
}

/**
 * @description 鼠标操作信息
 */
export interface MouseInfo {
  button: number, //按下的按钮
  isDown: boolean, //是否按下
  isDrag: boolean, //是否拖拽
  target: any, //鼠标目标
  type: MouseTargetTypes, // 目标类型
  beforePos: IVector2, // 之前位置
  enterTarget: any, // 鼠标在区域内的实例
  enterType: MouseTargetTypes,// 鼠标在区域内的类型
  timeStamp: { // 鼠标事件时间戳
    mouseUp: number,
    mouseDown: number,
  }
}

const dbclickTime = 230; // 双击时间判定

export class GraphEvents {

  rootDom: NativeDiv;
  selectedBox: NativeDiv | null = null; // 框选框

  viewer: GraphViewer

  menuItems: any;
  mouseInfo: MouseInfo;
  viewPosition: IVector2 = {
    x: 0,
    y: 0,
  }

  selectPos: IVector2 = {
    x: 0,
    y: 0,
  }

  private events: Signals = new Signals();

  private scale: number = 1

  constructor(rootDom: NativeDiv, viewer: GraphViewer) {
    this.viewer = viewer
    this.rootDom = rootDom;
    this.rootDom.setBackgroundColor('#838383');

    this.mouseInfo = {
      button: -1,
      isDown: false, //是否按下
      isDrag: false, //是否拖拽
      target: null,
      type: MouseTargetTypes.None,
      beforePos: {
        x: 0,
        y: 0,
      },
      enterTarget: null,
      enterType: MouseTargetTypes.None,
      timeStamp: {
        mouseDown: 0,
        mouseUp: 0,
      }
    }
    this.selectedBox = null; // 按住ctrl,触发框选
    this.initEventListener();
  }

  getScale(isLocal = false): number {
    if (isLocal) {
      return this.getParentScale() * this.scale
    }
    return this.scale
  }

  getParentScale(): number {
    if (this.viewer.graph.parentNode) {
      if (this.viewer.graph.parentNode.viewer) {
        return 1 / this.viewer.graph.parentNode.viewer.events.getScale(true)
      }
    }
    return 1
  }

  /**
   * @description: 设置缩放
   * @param {number} scale
   */
  setScale(scale: number): void {
    this.scale = scale

    // if (scale < 0.4) { // 最小缩放
    //   this.scale = 0.4;
    // } else if (scale > 3) { // 最大缩放
    //   this.scale = 3;
    // } else {
    //   this.scale = scale
    // }
    this.events.dispatch(GraphEventTypes.ViewScale, this.scale)
  }

  get add() {
    return this.events.add.bind(this.events);
  }

  get dispatch() {
    return this.events.dispatch.bind(this.events);
  }

  get get() {
    return this.events.get.bind(this.events);
  }

  get setReadOnly() {
    return this.events.setReadOnly.bind(this.events);
  }

  private initEventListener() {
    const events = [
      GraphEventTypes.MouseDown, GraphEventTypes.MouseUp, GraphEventTypes.MouseMove, GraphEventTypes.DoubleClick,
      GraphEventTypes.NodeDown, GraphEventTypes.DragNodeMove, GraphEventTypes.NodeUp,
      GraphEventTypes.SlotDown, GraphEventTypes.DragSlotMove, GraphEventTypes.SlotUp,
      GraphEventTypes.DragViewStart, GraphEventTypes.DragViewMove, GraphEventTypes.DragViewEnd,
      GraphEventTypes.OpenContextMenu, GraphEventTypes.CloseContextMenu, GraphEventTypes.Click,
      GraphEventTypes.OpenAssociativeMenu, GraphEventTypes.CloseAssociativeMenu,
      GraphEventTypes.DragSlotStart, GraphEventTypes.DragSlotEnd,
      GraphEventTypes.DragNodeStart, GraphEventTypes.DragNodeEnd,
      GraphEventTypes.NodeEnter, GraphEventTypes.NodeLeave, GraphEventTypes.SlotEnter, GraphEventTypes.SlotLeave,
      GraphEventTypes.ViewScale, GraphEventTypes.ViewResize, GraphEventTypes.LinksFresh, GraphEventTypes.AddRunLog,
      GraphEventTypes.SelectedNode, GraphEventTypes.DoubleRightClick, GraphEventTypes.DoubleLeftClick,
      GraphEventTypes.WidgetDown, GraphEventTypes.WidgetUp, GraphEventTypes.WidgetEnter, GraphEventTypes.WidgetLeave,

      // 蓝图动作
      GraphAction.AddNode, GraphAction.RemoveNode, GraphAction.CloneNode, GraphAction.AddNodeInput, GraphAction.AddNodeOutput,
      GraphAction.FocusOnNode, GraphAction.StartRun, GraphAction.StopRun, GraphAction.RemoveNodeSlot,

      // 节点事件
      NodeEvents.BeforeExecute,NodeEvents.AfterExecute,

      // 供外部使用事件
      CustomEvetns.Node,CustomEvetns.Widget,
    ];


    // 注册事件为信号
    for (let eve of events) {
      this.events.create(eve);
    }

    const mouseInfo = this.mouseInfo;
    let onceMove: boolean = true;//拖拽第一次移动时为true;

    this.rootDom.onContextmenu((e: MouseEvent) => {
      e.preventDefault();
    });

    this.rootDom.onMousedown((e: MouseEvent) => {
      // 隐藏所有下拉选择选项
      const dropdowns = this.rootDom.DOM.querySelectorAll('.ra-graph-select-dropdown')
      for (const dropdown of dropdowns) {
        const dropdownDom = dropdown as HTMLElement
        dropdownDom.style.display = 'none'
      }

      this.rootDom.setCursor("auto")
      const rect = this.rootDom.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      }

      if (e.ctrlKey || e.metaKey) {
        this.selectedBox = new NativeDiv();
        this.selectPos = {
          x: e.clientX - rect.x,
          y: e.clientY - rect.y,
        }
        // 按住ctrl键，框选
        this.selectedBox.setStyle({
          position: 'absolute',
          top: position.y + 'px',
          left: position.x + 'px',
          backgroundColor: '#00BFFF',
        })
        this.rootDom.add(this.selectedBox)
      }

      if (e.ctrlKey || e.metaKey) {
        this.selectedBox = new NativeDiv();
        this.selectPos = {
          x: e.clientX - rect.x,
          y: e.clientY - rect.y,
        }
        // 按住ctrl键，框选
        this.selectedBox.setStyle({
          position: 'absolute',
          top: position.y + 'px',
          left: position.x + 'px',
          backgroundColor: 'rgba(173,175,173,0.3)',
        })
        this.rootDom.add(this.selectedBox)
        return
      }
      this.events.dispatch(GraphEventTypes.MouseDown, position as IGraphMouseEvent);
      this.events.dispatch(GraphEventTypes.CloseAssociativeMenu);
      this.events.dispatch(GraphEventTypes.CloseContextMenu);

      mouseInfo.button = e.button;
      mouseInfo.isDown = true;

      mouseInfo.timeStamp.mouseDown = new Date().getTime();
    });

    //鼠标放开事件
    document.addEventListener('mouseup', (e: MouseEvent) => {
      // e.stopPropagation();
      const timeStamp = new Date().getTime();
      this.rootDom.setCursor("auto")

      const rect = this.rootDom.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      }

      if (this.selectedBox) {
        this.selectedBox.remove()
        this.selectedBox = null

        const endPos = position as IGraphMouseEvent;
        const startPos = this.selectPos as IGraphMouseEvent;
        this.events.dispatch(GraphEventTypes.SelectedNode, startPos, endPos);
        return
      }

      //是否是双击
      if (timeStamp - mouseInfo.timeStamp.mouseUp <= dbclickTime) {
        this.events.dispatch(GraphEventTypes.DoubleClick, position as IGraphMouseEvent, e);

        switch (mouseInfo.button) {
          case 0:
            //左键双击
            this.events.dispatch(GraphEventTypes.DoubleLeftClick, position, mouseInfo, e);
            break;
          case 2:
            //右键双击
            this.events.dispatch(GraphEventTypes.DoubleRightClick, position, mouseInfo, e);
            break;
        }



      } else {
        this.events.dispatch(GraphEventTypes.MouseUp, position as IGraphMouseEvent);

        if (mouseInfo.isDrag) {
          if (mouseInfo.button === 0) {
            switch (mouseInfo.type) {
              case MouseTargetTypes.Slot:
                this.events.dispatch(GraphEventTypes.DragSlotEnd, Object.assign({}, position), mouseInfo.target);

                if (mouseInfo.enterType === MouseTargetTypes.None) {
                  this.events.dispatch(GraphEventTypes.OpenAssociativeMenu, Object.assign({}, position), mouseInfo.target);
                }
                break;
              case MouseTargetTypes.Node:
                this.events.dispatch(GraphEventTypes.DragNodeEnd, Object.assign({}, position), mouseInfo.target);
                break;
              case MouseTargetTypes.None:
                this.events.dispatch(GraphEventTypes.DragViewEnd, Object.assign({}, position), mouseInfo.target);
                break;
            }
          }
        } else {
          if (mouseInfo.button === 0) {
            //单击鼠标左键
            this.events.dispatch(GraphEventTypes.Click, {
              type: mouseInfo.type,
              target: mouseInfo.target,
              position: Object.assign({}, position),
            });
          }
        }

        if (e.button === 2) {
          this.events.dispatch(GraphEventTypes.OpenContextMenu, {
            position: Object.assign({}, position),
            target: mouseInfo.target,
            type: mouseInfo.type
          });
        }
      }

      mouseInfo.isDown = false;
      mouseInfo.isDrag = false;
      mouseInfo.target = null;
      mouseInfo.type = MouseTargetTypes.None;
      mouseInfo.timeStamp.mouseUp = timeStamp;
      onceMove = true;
    });

    this.rootDom.onMousemove((e: MouseEvent) => {
      const rect = this.rootDom.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      }

      if (this.selectedBox) {
        let width = 0, height = 0, left = 0, top = 0;
        if (position.x >= this.selectPos.x && position.y >= this.selectPos.y) {
          width = position.x - this.selectPos.x
          height = position.y - this.selectPos.y
          top = this.selectPos.y
          left = this.selectPos.x
        } else if (position.x >= this.selectPos.x && position.y < this.selectPos.y) {
          width = position.x - this.selectPos.x
          height = this.selectPos.y - position.y
          top = position.y
          left = this.selectPos.x
        } else if (position.x < this.selectPos.x && position.y < this.selectPos.y) {
          width = this.selectPos.x - position.x
          height = this.selectPos.y - position.y
          top = position.y
          left = position.x
        } else if (position.x < this.selectPos.x && position.y >= this.selectPos.y) {
          width = this.selectPos.x - position.x
          height = position.y - this.selectPos.y
          top = this.selectPos.y
          left = position.x
        }
        this.selectedBox.setStyle({
          top: top + 'px',
          left: left + 'px',
          width: width + 'px',
          height: height + 'px',
        })
        return
      }

      this.events.dispatch(GraphEventTypes.MouseMove, position as IGraphMouseEvent);

      if (mouseInfo.isDown) mouseInfo.isDrag = true;
      if (mouseInfo.isDrag) {
        //拖拽中
        if (mouseInfo.button === 0) {
          // 左键拖拽

          switch (mouseInfo.type) {
            case MouseTargetTypes.Slot:
              if (onceMove) {
                this.events.dispatch(GraphEventTypes.DragSlotStart, Object.assign({}, position), mouseInfo.target);
              }
              this.events.dispatch(GraphEventTypes.DragSlotMove, Object.assign({}, position), mouseInfo.target);
              break;
            case MouseTargetTypes.Node:
              if (onceMove) {
                this.events.dispatch(GraphEventTypes.DragNodeStart, Object.assign({}, position), mouseInfo.target);
              }

              this.events.dispatch(GraphEventTypes.DragNodeMove, Object.assign({}, position), mouseInfo.target);
              break;
            case MouseTargetTypes.None:
              this.rootDom.setCursor("move")

              this.viewPosition.x += (position.x - mouseInfo.beforePos.x);
              this.viewPosition.y += (position.y - mouseInfo.beforePos.y);

              if (onceMove) {
                this.events.dispatch(GraphEventTypes.DragViewStart, Object.assign({}, position), mouseInfo.target);
              }

              this.events.dispatch(GraphEventTypes.DragViewMove, Object.assign({}, position), mouseInfo.target);
              break;
          }
        }

        onceMove = false;
      }

      mouseInfo.beforePos = {
        x: position.x,
        y: position.y,
      }
    });

    this.rootDom.DOM.addEventListener("wheel", (e: WheelEvent) => {
      // 触摸板放大、Ctrl+滚轮放大
      e.preventDefault();
      // 鼠标距可视区域距离
      // let mouseX = e.clientX - this.rootDom.DOM.offsetLeft
      // let mouseY = e.clientY - this.rootDom.DOM.offsetTop
      let mouseX = e.clientX - this.rootDom.DOM.getBoundingClientRect().left
      let mouseY = e.clientY - this.rootDom.DOM.getBoundingClientRect().top
      // 假设鼠标点处是一个节点的左上顶点，换算其position
      const fakeX = (mouseX - this.viewPosition.x) / this.scale
      const fakeY = (mouseY - this.viewPosition.y) / this.scale
      // 触摸板放大、Ctrl+滚轮放大
      // deltaY 有小数点一定是滚轮，而不是触摸板
      if (e.altKey || e.ctrlKey || e.metaKey || e.deltaY.toString().indexOf(".") >-1 ) {
        const newScale = this.scale - e.deltaY / (e.ctrlKey ? 200 : 2000);
        const newPos = {
          x: - fakeX * newScale + mouseX,
          y: - fakeY * newScale + mouseY
        }
        if (newScale < 0.4 || newScale > 3) {
          return ;
        }
        this.viewPosition.x = newPos.x
        this.viewPosition.y = newPos.y
        this.setScale(newScale);
      } else {
        // 触摸板上下左右滑动
        e.preventDefault();
        this.viewPosition.x += e.deltaX / 1.5
        this.viewPosition.y += e.deltaY / 1.5
        this.events.dispatch(GraphEventTypes.DragViewMove, Object.assign({}, { x: e.deltaX, y: e.deltaY }), mouseInfo.target);
      }
    }, { passive: false })

    // 监听rootdom的大小变化
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.events.dispatch(GraphEventTypes.ViewResize, width, height);
      }
    });
    resizeObserver.observe(this.rootDom.DOM);

    this.rootDom.DOM.addEventListener('resize', () => {
      this.events.dispatch(GraphEventTypes.ViewResize, this.rootDom.DOM.clientWidth, this.rootDom.DOM.clientHeight);
    })

    // 在插槽中按下鼠标
    this.events.add(GraphEventTypes.SlotDown, (e: MouseEvent, rNode: INodeRender, rSlot: IInputRender | IOutputRender) => {
      mouseInfo.button = e.button;
      mouseInfo.isDown = true;
      mouseInfo.type = MouseTargetTypes.Slot;
      mouseInfo.target = {
        nodeRender: rNode,
        slotRender: rSlot,
      }
    });

    // 在节点中按下鼠标
    this.events.add(GraphEventTypes.NodeDown, (e: MouseEvent, rNode: INodeRender) => {
      mouseInfo.button = e.button;
      mouseInfo.isDown = true;
      mouseInfo.type = MouseTargetTypes.Node;
      mouseInfo.target = {
        nodeRender: rNode,
      }
    });

    // 鼠标移入node
    this.events.add(GraphEventTypes.NodeEnter, (rNode: INodeRender) => {
      this.mouseInfo.enterTarget = rNode;
      this.mouseInfo.enterType = MouseTargetTypes.Node;
    });

    // 鼠标移出node
    this.events.add(GraphEventTypes.NodeLeave, (rNode: INodeRender) => {
      this.mouseInfo.enterTarget = null;
      this.mouseInfo.enterType = MouseTargetTypes.None;
    });

    // 鼠标移入slot
    this.events.add(GraphEventTypes.SlotEnter, (rSlot: IInputRender | IOutputRender) => {
      this.mouseInfo.enterTarget = rSlot;
      this.mouseInfo.enterType = MouseTargetTypes.Slot;
    });

    // 鼠标移出slot
    this.events.add(GraphEventTypes.SlotLeave, (rSlot: IInputRender | IOutputRender) => {
      this.mouseInfo.enterTarget = null;
      this.mouseInfo.enterType = MouseTargetTypes.None;
    });

    // 在Widget中按下鼠标
    this.events.add(GraphEventTypes.WidgetDown, (e: MouseEvent, rNode: INodeRender, widget: any) => {
      mouseInfo.button = e.button;
      mouseInfo.isDown = true;
      mouseInfo.type = MouseTargetTypes.Widget;
      mouseInfo.target = {
        nodeRender: rNode,
        widget: widget
      }
    });

    // 鼠标移入widget
    this.events.add(GraphEventTypes.WidgetEnter, (e: MouseEvent, rNode: INodeRender, widget: any) => {
      this.mouseInfo.enterTarget = widget;
      this.mouseInfo.enterType = MouseTargetTypes.Widget;
    });

    // 鼠标移出widget
    this.events.add(GraphEventTypes.WidgetLeave, (e: MouseEvent, rNode: INodeRender, widget: any) => {
      this.mouseInfo.enterTarget = null;
      this.mouseInfo.enterType = MouseTargetTypes.None;
    });
  }
}
