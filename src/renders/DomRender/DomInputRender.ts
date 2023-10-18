import { NodeInput, NodeOutput } from "../../core";
import { IInputRender, INodeRender, IOutputRender } from "../../interfaces";
import { NativeDiv } from "../../shared";
import { DomSlotRender } from "../DomRender";
/**
 * @description dom渲染input
 */
export class DomInputRender extends DomSlotRender implements IInputRender {
    declare slot: NodeInput;
  
    constructor(parent: INodeRender, parentDom: NativeDiv, slot: NodeInput) {
      super(parent, parentDom, slot);
    }
  }
  