import { INodeInput, INodeOutput, IVector2, IVector3, NodeType, Node, Graph, ExternalGraph, NodeId } from "../core";
import { NSubGraph } from "../core/graph/nodes";
import { ContextMenuDivider, IContextMenuItem, IFunction, IKeyType, IKeyValue, INodeRender, IUIManager } from "../interfaces";
import { NativeDiv } from "../shared";
import { NodePanel } from "../shared/UI/NodePanel";
import { GraphAction, GraphEventTypes, RenderTypes } from "../types";
import { wait, AppendCss } from "../Utils";
import { GraphEvents, GraphViewer } from "../viewer";
export interface IUIMenu {
  menu: NativeDiv,
  width: number,
  directionX: 'left' | 'right',
}
export class DomUIManager implements IUIManager {
  type: RenderTypes = RenderTypes.DomUI;
  rootDom: NativeDiv;
  events: GraphEvents;

  private contextMenu: IUIMenu;
  private associativeMenu: IUIMenu;
  private nodePanel: NodePanel;

  isShowContextMenu: boolean = false;

  constructor(rootDom: NativeDiv, events: GraphEvents) {
    this.rootDom = rootDom;
    this.events = events;

    this.contextMenu = this.createMenu(this.rootDom);
    this.associativeMenu = this.createMenu(this.rootDom);

    this.nodePanel = new NodePanel(this.rootDom);

    // @mark 点击节点如果不是自己这个节点，关闭nodepanel
    this.events.add(GraphEventTypes.NodeDown, (e: MouseEvent, node: INodeRender) => {
      if (this.nodePanel.render && node !== this.nodePanel.render) {
        this.nodePanel.hide()
      }
    })
  }

  private createMenu(parent: NativeDiv): IUIMenu {
    const contextmenu = new NativeDiv()

    contextmenu.setAbsolute()
    contextmenu.addClass('g-menu')
      .setStyle({
        minWidth: '88px',
        width: '88px',
        minHeight: '20px',
        backgroundColor: 'rgb(59, 59, 59)',
        borderRadius: '3px',
        boxShadow: '2px 2px 7px 1px rgba(0, 0, 0, .2)',
        userSelect: 'none',
        display: 'flex',
        alignContent: 'center',
        flexWrap: 'wrap',
        flex: '1',
      })
      .hide()


    const stopPropagation = (e: MouseEvent) => {
      e.stopPropagation();
      return false;
    }

    contextmenu.DOM.addEventListener('pointerdown', stopPropagation);
    contextmenu.DOM.addEventListener('pointerup', stopPropagation);
    contextmenu.DOM.addEventListener('pointermove', stopPropagation);
    contextmenu.DOM.addEventListener('mousedown', stopPropagation);
    contextmenu.DOM.addEventListener('mouseup', stopPropagation);
    contextmenu.DOM.addEventListener('mousemove', stopPropagation);
    contextmenu.onWheel((e: any) => {
      e.stopPropagation();

      if (e.wheelDelta > 0) {
        contextmenu.setTop(contextmenu.getOffsetTop() + 10);
      } else {
        contextmenu.setTop(contextmenu.getOffsetTop() - 10);
      }
    });

    parent.add(contextmenu);
    return {
      menu: contextmenu,
      width: 0,
      directionX: 'left',
    };
  }

  /**
   * @description 当点击右键菜单时触发内容
   * @param { IVector2 } position 起始点击位置
   * @param { number } index 点击第几项
   * @param { NativeDiv } parent 父菜单dom
   * @param { Array< IContextMenuItem  | ContextMenuDivider> | undefined } subMenu 子菜单数据
   * @param { Function } callback 回调函数
   * @returns 
   */
  private onMenuClick(position: IVector2, index: number, parentObj: IUIMenu, subMenu: Array<IContextMenuItem | ContextMenuDivider> | undefined, callback: IFunction | undefined, onClick: IFunction | undefined) {
    return () => {
      const parent = parentObj.menu;
      callback && callback(position);

      //将已经打开的子菜单删除
      const opened = parent.DOM.getElementsByClassName(`${NativeDiv.prefix}g-menu`);

      for (let child of opened) {
        parent.DOM.removeChild(child);
      }

      if (!subMenu) {
        onClick && onClick();
      } else {
        const menuDom = this.createMenu(parent);
        menuDom.directionX = parentObj.directionX;
        menuDom.menu.setStyle({
          display: 'flex',
        })
          .setLeft(parent.DOM.offsetWidth + 2)
          .setTop(26 * index)

        if (parentObj.directionX === 'right') {
          setTimeout(() => {
            menuDom.menu.setLeft(-menuDom.menu.getClientWidth() - 3);
          }, 0);
        }

        this.addItemInMenu(position, menuDom, subMenu, onClick);
      }
    }
  }

  /**
   * @description 添加菜单项到右键菜单中
   */
  private addItemInMenu(position: IVector2, menuObj: IUIMenu, menu: Array<IContextMenuItem | ContextMenuDivider>, onClick: IFunction | undefined) {
    const contextmenu = menuObj.menu;
    let dividerNum = 0;
    for (let index in menu) {
      const mi = menu[index];

      const item = new NativeDiv();
      if (!mi) {
        //这里是添加分割线
        dividerNum += 1;

        item.setStyle({
          backgroundColor: '#919191',
          width: 'calc( 100% - 10px )',
          height: '1px',
          marginLeft: '5px',
          marginRight: '5px'
        })
      } else {
        const { label, callback, subMenu } = mi;

        item.setStyle({
          height: '18px',
          width: '100%',
          color: 'white',
          fontSize: '13px',
          cursor: 'pointer',
          borderRadius: '3px',
          padding: '4px',
          textAlign: 'center',
        }).innerText(label);

        item.onMouseover(() => {
          item.setStyle({
            backgroundColor: '#505050',
          })
        });

        item.onMouseout(() => {
          item.setStyle({
            backgroundColor: 'rgb(59, 59, 59)',
          })
        });

        //计算宽度
        const num = Math.trunc(label.length / 5);
        if (num >= 1) {
          const w = num * 88 + (((label.length % 5) * 0.1) * 88);

          if (contextmenu.getClientWidth() < w) {
            contextmenu.setWidth(w);
          }

          menuObj.width = w;
        } else {
          menuObj.width = 88;
        }


        if (subMenu) {
          const subIcon = new NativeDiv();
          subIcon.setStyle({
            position: 'absolute',
            width: '3px',
            height: '18px',
            right: '3px',
            top: `${(parseInt(index) - dividerNum) * 26 + (dividerNum * 1) + 4}px`,
            background: '#61ff3c',
            borderRadius: '5px',
          })
          item.add(subIcon);
        }

        item.onClick(this.onMenuClick(position, parseInt(index) - dividerNum, menuObj, subMenu, callback, onClick))
      }

      contextmenu.add(item);
    }
  }

  private showMenu(menuObj: IUIMenu, x: number, y: number) {
    const menu = menuObj.menu;
    const offsetScale = this.events.getParentScale()
    const maxWidth = this.rootDom.getClientWidth();

    menu.setStyle({
      transform: `scale(${offsetScale})`,
      transformOrigin: "left top"
    })

    if ((menuObj.width + x)*offsetScale > maxWidth) {
      menu.setLeft((x - menuObj.width) * offsetScale)
        .setTop(y * offsetScale)
      menuObj.directionX = 'right';
    } else {
      menu.setLeft(x * offsetScale)
        .setTop(y * offsetScale)
      menuObj.directionX = 'left';
    }

    setTimeout(() => {
      menu.setStyle({
        display: 'flex',
      });
    }, 0);
  }

  /**
   * @description 打开右键菜单
   */
  openContextMenu({ x, y, }: IVector2, menu: Array<IContextMenuItem | ContextMenuDivider>) {
    this.contextMenu.menu.innerText('');

    this.addItemInMenu({ x, y }, this.contextMenu, menu, () => {
      this.closeContextMenu();
    });

    this.showMenu(this.contextMenu, x, y);

    this.isShowContextMenu = true;
  }

  /**
   * @description 关闭右键菜单
   */
  closeContextMenu() {
    this.contextMenu.menu.hide()
    this.isShowContextMenu = false;
  }

  /**
   * @description 获取右键菜单
   * @param nodeClassInfo 
   * @returns 
   */
  getContextMenu(viewer: GraphViewer): Array<IContextMenuItem | ContextMenuDivider> {
    const graph = viewer.graph;
    const nodeClassInfo = graph.getNodeClassInfo();

    const getCallback = (type: NodeType) => {
      const scale = this.events.getScale();
      return (position: IVector3) => {
        this.events.dispatch(GraphAction.AddNode, type, {
          x: (position.x - this.events.viewPosition.x) / scale,
          y: (position.y - this.events.viewPosition.y) / scale,
        });
      }
    }

    //第一级别菜单
    const topMenu: Array<IContextMenuItem | ContextMenuDivider> = [];

    //根据path获取层级的子菜单指针
    const map: IKeyType<Array<IContextMenuItem | ContextMenuDivider>> = {};

    // 处理添加节点的类型
    for (let type in nodeClassInfo) {
      const { label, path, notAddContextMenu } = nodeClassInfo[type];
      if (notAddContextMenu) continue;
      //执行创建最后一层的菜单
      const result = {
        label,
        callback: getCallback(type),
      }

      if (path === "") {
        topMenu.push(result);
      } else {
        const list = path.split('/');

        let cate = '';
        for (let index in list) {
          const category = list[index];
          const id = `${cate}_${category}`;

          if (parseInt(index) === 0) {
            if (!map[id]) {
              //如果是第一级且没被记录过
              const subMenu: Array<IContextMenuItem | ContextMenuDivider> = [];
              map[id] = subMenu;
              topMenu.push({
                label: category,
                subMenu,
              });
            }
          } else {
            if (!map[id]) {
              //如果不是是第一级且没被记录过
              const parentMenu = map[cate];
              const subMenu: Array<IContextMenuItem | ContextMenuDivider> = [];
              map[id] = subMenu;

              parentMenu.push({
                label: category,
                subMenu,
              })
            }
          }

          if (parseInt(index) === list.length - 1) {
            const parentMenu = map[id];
            parentMenu.push(result);
          }

          cate = id;
        }
      }
    }

    // 游离子图相关
    const extTopMenu: Array<IContextMenuItem | ContextMenuDivider> = [];
    const exts: IKeyType<ExternalGraph> = graph.externalGraph;
    const scale  = this.events.getScale()

    for (let id in exts) {
      const { name, data } = exts[id];
      extTopMenu.push({
        label: name,
        callback: (position: IVector3) => {
          const subGraph = new Graph();
          subGraph.deserialize(data);

          const node = viewer.addNode(graph.subGraphType, {
          x: (position.x - this.events.viewPosition.x) / scale,
          y: (position.y - this.events.viewPosition.y) / scale,
          z:0
        }) as NSubGraph | null;
          if (!node) return;
          node.setSubGraph(subGraph);
          node.refreshViewer();
          node.getLabel = () => {
            return name;
          }
        }
      })
    }

    const menu: Array<IContextMenuItem | ContextMenuDivider> = [{
      label: '添加节点',
      subMenu: topMenu,
    }];

    if (extTopMenu.length !== 0) {
      menu.push({
        label: '游离子图',
        subMenu: extTopMenu
      })
    }

    return menu;
  }

  /**
   * @description 打开关联菜单
   * @param position 
   * @param typeList 
   */
  openAssociativeMenu(node: Node, slot: INodeInput | INodeOutput, position: IVector2, typeList: Array<IKeyValue>) {
    const menu: Array<IContextMenuItem | ContextMenuDivider> = []
    this.associativeMenu.menu.innerText('');

    for (let { type, label, path, associativeNode } of typeList) {
      menu.push({
        label,
        callback: () => {
          // 节点坐标减去画布偏移坐标量
          if (node.viewer){
            position.x -= node.viewer.events.viewPosition.x
            position.y -= node.viewer.events.viewPosition.y
          }
          this.events.dispatch(GraphAction.AddNode, type, position);
        }
      })
    }
    
    if(menu.length === 0) return;
    this.addItemInMenu(position, this.associativeMenu, menu, () => {
      this.closeAssociativeMenu();
    });
    this.showMenu(this.associativeMenu, position.x, position.y);
  }

  /**
   * @description 关闭关联菜单
   */
  closeAssociativeMenu() {
    this.associativeMenu.menu.hide();
  }

  /**
   * @description 打开节点面板
   */
  openNodePanel(nodeRender: INodeRender) {
    this.nodePanel.show(nodeRender);
  }
}