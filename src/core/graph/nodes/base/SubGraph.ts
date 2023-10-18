/*
 * @Date: 2023-08-07 15:23:29
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-10-07 15:43:59
 * @FilePath: /graph/src/core/graph/nodes/base/SubGraph.ts
 */
import {IFunction} from '../../../../interfaces';
import {DomNodeRender} from '../../../../renders';
import {NativeButton, NativeDiv} from '../../../../shared';
import Alert from '../../../../shared/UI/Alert';
import GraphWidget, {GraphWidgetModes} from '../../../../shared/UI/widgets/GraphWidget';
import {GraphEventTypes} from '../../../../types';
import {Graph, InputInitOption, Node, OutputInitOption,} from "../../../graph";
import {NodeType} from "../../../types";

/**
 * @description 子图
 */
export class NSubGraph extends Node {
  static override NodeType: NodeType = "subGraph"; //节点类型
  static override NodeLabel: string = "子图"; //节点显示名
  static override NodePath: string = "子图节点"; // 节点路径

  public graphWidget: GraphWidget | null;

  public minSize: DOMRect | null = null

  public originRect: DOMRect | undefined

  private exitFunc: IFunction | null = null;

  public get subViewer() {
    if (!this.graphWidget) return null;
    if (!this.graphWidget.viewer) return null;
    return this.graphWidget.viewer;
  }

  // 是否正在放大状态？
  public isMaxmized: boolean = false

  override addInputsConfig: Array<InputInitOption> = [{
    label: '输入项',
    options: {
      remove: true,
    },
    valueType: ['any'],
  }];

  override addOutputsConfig: Array<OutputInitOption> = [{
    label: '输出项',
    options: {
      remove: true,
    },
    valueType: 'any',
  }];

  constructor() {

    super();

    // @mark 子图依然使用label进行渲染标题
    // this.setProperty('SubGraphName', '新的子图');

    this.subGraph = new Graph();
    this.subGraph.parentNode = this;

    this.setOption('addInput', true);
    this.setOption('addOutput', true);

    this.graphWidget = this.addWidget('graph', { graph: this.subGraph }) as GraphWidget;
    this.graphWidget.onChangeMode = (mode: GraphWidgetModes) => {
      if (!this.graphWidget) return;
      if (mode === GraphWidgetModes.min) {
        setTimeout(() => {
          this.render?.setSize(this.graphWidget!.minDom.getClientWidth(), this.graphWidget!.minDom.getClientHeight());
        }, 0);
      }
    }

    this.graphWidget.viewer.events.add(GraphEventTypes.MouseUp, async () => {
      // if(!this.viewer || !this.graphWidget) return;

      // const subViewer = this.graphWidget.viewer as GraphViewer;

      // const subUIMan = subViewer.getRenderByTarget(RenderTargetTypes.UI) as IUIManager;
      // if(!subUIMan.isShowContextMenu) return;
      // await wait(0);
      // this.viewer.events.dispatch(GraphEventTypes.CloseContextMenu);
    });
  }

  public refreshViewer() {
    this.graphWidget?.refresh(true);
  }

  override setSubGraph(v: Graph | null) {
    super.setSubGraph(v);

    if (this.graphWidget && v) {
      this.graphWidget.setGraph(v);
    }
  }

  override initedRender() {
    const render = this.render as DomNodeRender;
    if (!render) return;
    this.minSize = render.getContent().getBoundingClientRect()
    this.originRect = this.graphWidget?.viewerDom.getBoundingClientRect()

    // @detail @mark 在上级窗口变化大小时直接退出全屏模式，避免出现漏出上级画布
    // 无需递归寻找顶级，自然会全部缩小
    render.events.add(GraphEventTypes.ViewResize,() => {
      if(this.exitFunc){
        this.exitFunc()
      }
    })
  }

  // override getLabel() {
  //   return this.getProperty('SubGraphName')
  // }

  override onNodeHighLight(): void {
    if (!this.graphWidget) return;
    switch (this.graphWidget.mode) {
      case GraphWidgetModes.min:
        this.setOption('notResize', true);
        break;
      case GraphWidgetModes.window:
        this.setOption('notResize', false);
        break;
    }
  }

  override onRefresh(): void {
    const render = this.render as DomNodeRender;
    if (!render) return;
    // 添加最大化按钮，在title的右侧
    let maxButton = new NativeDiv()
    maxButton.innerText("+")
    maxButton.setStyle({
      position: "absolute",
      right: "6px",
      top: "4px",
      height: "25px",
      lineHeight: "25px",
      textAlign: "center",
      width: "25px",
      borderRadius: "50%",
      backgroundColor: "black",
      color: "white"
    })

    maxButton.onClick(() => {
      this.maxmizeViewer();
    })

    render.title.add(maxButton)
  }

  public getName(): string {
    if (this.graph?.parentNode) {
      const node = this.graph.parentNode as NSubGraph;
      return node.getName() + " => " + this.label
    }
    return this.label
  }

  private maxmizeViewer() {
    if (this.graphWidget?.mode == GraphWidgetModes.min) {
      Alert.warning("子图收缩中，无法放大")
      return
    }
    // 长宽一定是上级viewerDom的实际长宽
    const render = this.render!
    const nowViewer = this.graphWidget?.viewer;
    const parentViewer = render.events.viewer;
    const parentViewerDomRect = parentViewer?.rootDom.getBoundingClientRect();
    // todo 子图套子图时的回归缩放处理
    const originStyle = {
      position: nowViewer?.rootDom.DOM.style.position,
      zIndex: nowViewer?.rootDom.DOM.style.zIndex,
      left: nowViewer?.rootDom.DOM.style.left,
      top: nowViewer?.rootDom.DOM.style.top,
      width: nowViewer?.rootDom.DOM.style.width,
      height: nowViewer?.rootDom.DOM.style.height,
      // transition:nowViewer?.rootDom.DOM.style.transition
    }
    const originViewPosition = nowViewer?.events.viewPosition
    // const offsetScale = render.events.getParentScale();
    const scale = render.events.getScale()
    // this.
    nowViewer?.rootDom.setAbsolute(
      - render.events.viewPosition.y - this.position.y,
      - render.events.viewPosition.x - this.position.x,
      99999
    ).setWidth(parentViewerDomRect!.width)
      .setHeight(parentViewerDomRect!.height)
      .setStyle({
        transition: "all .5s ease"
      })

    // 关闭父级的control 和minimap
    parentViewer?.tools.miniMap?.hide()
    parentViewer?.tools.control?.hide()

    let button = new NativeButton("退出子图")
    button.setStyle({
      zIndex: "123123",
      marginLeft: "10px"
    })
    button.onClick(() => {
      exit();
    })

    // 当前viewer的UI处理
    nowViewer?.tools.control?.add(button)
    nowViewer?.tools.miniMap?.show()
    // Alert.info("子图全屏=功能实现中。。。")
    // 恢复缩放
    parentViewer.setScale(1);

    // 显示title
    let title = new NativeDiv();
    title.innerText(this.getName()).setColor(this.getOption("nodeColor") ?? "white").setFontSize(30).setStyle({
      fontWeight: "bold",
      marginTop: "10px",
      userSelect: "none",
      webkitUserSelect: "none",
      width: "100%",
      textAlign: "center"
    })
    nowViewer?.rootDom.add(title)

    // 聚焦首个节点
    setTimeout(() => {
      const nodes = nowViewer?.graph.getNodes()
      if (nodes && nodes.length) {
        nowViewer?.focusOnNode(nodes[0].id)
      }
    }, 500);

    let exit = () => {
      this.exitFunc = null;
      // 清除恢复的缩放
      parentViewer.setScale(scale);
      nowViewer?.rootDom.setStyle(originStyle)
      // 恢复父级
      if (!parentViewer.graph.parentNode) {
        parentViewer.tools.miniMap?.show()
      }

      if (parentViewer.graph.parentNode && parentViewer.rootDom.DOM.style.position == "absolute") {
        parentViewer.tools.miniMap?.show()
      }
      parentViewer.tools.control?.setFlex()

      // 删除按钮
      button.remove()
      title.remove()
      nowViewer?.tools.miniMap?.hide()
      setTimeout(() => {
        nowViewer?.rootDom.setStyle({
          transition: "none"
        })
      }, 500);

      // 恢复原本的 viewposition
      nowViewer!.events.viewPosition = originViewPosition!
      nowViewer?.getNodeManager().setPosition()
    }
    this.exitFunc = exit;
  }
}
