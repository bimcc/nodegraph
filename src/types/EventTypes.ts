/*
 * @Date: 2023-06-20 09:50:43
 * @LastEditors: asahi
 * @LastEditTime: 2023-09-15 17:15:04
 * @FilePath: \litegraph\src\types\EventTypes.ts
 */
/**
 * @description 蓝图事件枚举
 */
export enum GraphEventTypes {
  MouseMove = 'MouseMove',
  MouseDown = 'MouseDown',
  MouseUp = 'MouseUp',

  SelectedNode = 'SelectedNode',

  NodeDown = 'NodeDown',
  NodeUp = 'NodeUp',
  NodeEnter = 'NodeEnter',
  NodeLeave = 'NodeLeave',
  DragNodeStart = 'DragNodeStart',
  DragNodeMove = 'DragNodeMove',
  DragNodeEnd = 'DragNodeEnd',

  WidgetDown = 'WidgetDown',
  WidgetUp = 'WidgetUp',
  WidgetEnter = 'WidgetEnter',
  WidgetLeave = 'WidgetLeave',

  SlotDown = 'SlotDown',
  SlotUp = 'SlotUp',
  SlotEnter = 'SlotEnter',
  SlotLeave = 'SlotLeave',
  DragSlotStart = 'DragSlotStart',
  DragSlotMove = 'DragSlotMove',
  DragSlotEnd = 'DragSlotEnd',

  DragViewStart = 'DragViewStart',
  DragViewMove = 'DragViewMove',
  DragViewEnd = 'DragViewEnd',

  OpenContextMenu = 'ContextMenu',
  CloseContextMenu = 'CloseContextMenu',

  OpenAssociativeMenu = 'OpenAssociativeMenu',
  CloseAssociativeMenu = 'CloseAssociativeMenu',

  Click = 'Click',
  DoubleClick = 'dblClick',
  DoubleLeftClick = 'DoubleLeftClick',
  DoubleRightClick = 'DoubleRightClick',
  ViewScale = "ViewScale",
  ViewResize = "ViewResize",
  LinksFresh = "LinksFresh",
  AddRunLog = "AddRunLog"
}

/**
 * @description 蓝图动作
 */

export enum GraphAction {
  AddNode = 'ActionAddNode',
  RemoveNode = 'ActionRemoveNode',
  CloneNode = 'ActionCloneNode',
  AddNodeInput = 'ActionAddNodeInput',
  AddNodeOutput = 'ActionAddNodeOutput',
  FocusOnNode = "FocusOnNode",
  StopRun = "StopRun",
  StartRun = "StartRun",
  RemoveNodeSlot = 'RemoveNodeSlot',
}

/**
 * @description 节点内部事件
 */
export enum NodeRenderEvents {
  Resize = 'NodeRenderResize',
  Refresh = 'NodeRenderRefresh',
  Down = 'NodeRenderDown',
}

export enum NodeEvents {
  BeforeExecute = 'NodeBeforeExecute',
  AfterExecute = 'NodeAfterExecute',
}


export enum CustomEvetns {
  Widget = 'WidgetCustomEvetns',
  Node = 'NodeCustomEvetns',
}