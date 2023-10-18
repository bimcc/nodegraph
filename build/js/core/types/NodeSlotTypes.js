/*
 * @Date: 2023-06-14 13:42:47
 * @LastEditors: asahi
 * @LastEditTime: 2023-06-14 13:44:16
 * @FilePath: \litegraph\src\core\types\SlotTypes.ts
 */
/**
 * @description 插槽类型
 */
export var SlotTypes;
(function (SlotTypes) {
    SlotTypes[SlotTypes["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    SlotTypes[SlotTypes["INPUT"] = 1] = "INPUT";
    SlotTypes[SlotTypes["OUTPUT"] = 2] = "OUTPUT";
})(SlotTypes || (SlotTypes = {}));
