/*
 * @Date: 2023-08-04 11:51:17
 * @LastEditors: asahi
 * @LastEditTime: 2023-08-04 17:13:11
 * @FilePath: \litegraph\src\renders\DomRender\DomOutputRender.ts
 */
import { NodeOutput } from "../../core";
import { INodeRender, IOutputRender } from "../../interfaces";
import { NativeDiv } from "../../shared";
import { DomSlotRender } from "../DomRender";

/**
 * @description dom渲染output
 */
export class DomOutputRender extends DomSlotRender implements IOutputRender {
    declare slot: NodeOutput;
  
    constructor(parent: INodeRender, parentDom: NativeDiv, slot: NodeOutput) {
      super(parent, parentDom, slot);
    }
  }