/*
 * @LastEditors: lisushuang
 * @Description: canvas 节点
 * @FilePath: /graph/src/shared/UI/NativeCanvas.ts
 * @Date: 2023-07-25 13:55:16
 * @LastEditTime: 2023-09-05 18:33:38
 * @Author: lisushuang
 */
import { DomBase } from "./Base";


export class NativeCanvas extends DomBase {

  public ctx: CanvasRenderingContext2D

  constructor() {
    super("canvas")
    this.ctx = (this.DOM as HTMLCanvasElement).getContext("2d")!

    this.ctx.translate(0.5, 0.5); 
  }
}
