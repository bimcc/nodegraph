/*
 * @Date: 2023-06-20 09:50:43
 * @LastEditors: asahi
 * @LastEditTime: 2023-09-15 17:15:04
 * @FilePath: \litegraph\src\types\EventTypes.ts
 */
/**
 * @description 蓝图事件枚举
 */
export var GraphEventTypes;
(function (GraphEventTypes) {
    GraphEventTypes["MouseMove"] = "MouseMove";
    GraphEventTypes["MouseDown"] = "MouseDown";
    GraphEventTypes["MouseUp"] = "MouseUp";
    GraphEventTypes["SelectedNode"] = "SelectedNode";
    GraphEventTypes["NodeDown"] = "NodeDown";
    GraphEventTypes["NodeUp"] = "NodeUp";
    GraphEventTypes["NodeEnter"] = "NodeEnter";
    GraphEventTypes["NodeLeave"] = "NodeLeave";
    GraphEventTypes["DragNodeStart"] = "DragNodeStart";
    GraphEventTypes["DragNodeMove"] = "DragNodeMove";
    GraphEventTypes["DragNodeEnd"] = "DragNodeEnd";
    GraphEventTypes["WidgetDown"] = "WidgetDown";
    GraphEventTypes["WidgetUp"] = "WidgetUp";
    GraphEventTypes["WidgetEnter"] = "WidgetEnter";
    GraphEventTypes["WidgetLeave"] = "WidgetLeave";
    GraphEventTypes["SlotDown"] = "SlotDown";
    GraphEventTypes["SlotUp"] = "SlotUp";
    GraphEventTypes["SlotEnter"] = "SlotEnter";
    GraphEventTypes["SlotLeave"] = "SlotLeave";
    GraphEventTypes["DragSlotStart"] = "DragSlotStart";
    GraphEventTypes["DragSlotMove"] = "DragSlotMove";
    GraphEventTypes["DragSlotEnd"] = "DragSlotEnd";
    GraphEventTypes["DragViewStart"] = "DragViewStart";
    GraphEventTypes["DragViewMove"] = "DragViewMove";
    GraphEventTypes["DragViewEnd"] = "DragViewEnd";
    GraphEventTypes["OpenContextMenu"] = "ContextMenu";
    GraphEventTypes["CloseContextMenu"] = "CloseContextMenu";
    GraphEventTypes["OpenAssociativeMenu"] = "OpenAssociativeMenu";
    GraphEventTypes["CloseAssociativeMenu"] = "CloseAssociativeMenu";
    GraphEventTypes["Click"] = "Click";
    GraphEventTypes["DoubleClick"] = "dblClick";
    GraphEventTypes["DoubleLeftClick"] = "DoubleLeftClick";
    GraphEventTypes["DoubleRightClick"] = "DoubleRightClick";
    GraphEventTypes["ViewScale"] = "ViewScale";
    GraphEventTypes["ViewResize"] = "ViewResize";
    GraphEventTypes["LinksFresh"] = "LinksFresh";
    GraphEventTypes["AddRunLog"] = "AddRunLog";
})(GraphEventTypes || (GraphEventTypes = {}));
/**
 * @description 蓝图动作
 */
export var GraphAction;
(function (GraphAction) {
    GraphAction["AddNode"] = "ActionAddNode";
    GraphAction["RemoveNode"] = "ActionRemoveNode";
    GraphAction["CloneNode"] = "ActionCloneNode";
    GraphAction["AddNodeInput"] = "ActionAddNodeInput";
    GraphAction["AddNodeOutput"] = "ActionAddNodeOutput";
    GraphAction["FocusOnNode"] = "FocusOnNode";
    GraphAction["StopRun"] = "StopRun";
    GraphAction["StartRun"] = "StartRun";
    GraphAction["RemoveNodeSlot"] = "RemoveNodeSlot";
})(GraphAction || (GraphAction = {}));
/**
 * @description 节点内部事件
 */
export var NodeRenderEvents;
(function (NodeRenderEvents) {
    NodeRenderEvents["Resize"] = "NodeRenderResize";
    NodeRenderEvents["Refresh"] = "NodeRenderRefresh";
    NodeRenderEvents["Down"] = "NodeRenderDown";
})(NodeRenderEvents || (NodeRenderEvents = {}));
export var NodeEvents;
(function (NodeEvents) {
    NodeEvents["BeforeExecute"] = "NodeBeforeExecute";
    NodeEvents["AfterExecute"] = "NodeAfterExecute";
})(NodeEvents || (NodeEvents = {}));
export var CustomEvetns;
(function (CustomEvetns) {
    CustomEvetns["Widget"] = "WidgetCustomEvetns";
    CustomEvetns["Node"] = "NodeCustomEvetns";
})(CustomEvetns || (CustomEvetns = {}));
