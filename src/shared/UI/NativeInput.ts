/*
 * @LastEditors: lisushuang
 * @Description: input
 * @FilePath: /graph/src/shared/UI/NativeInput.ts
 * @Date: 2023-07-24 11:47:59
 * @LastEditTime: 2023-07-27 14:08:35
 * @Author: lisushuang
 */

import { DomBase } from "./Base";

export class NaiveInput extends DomBase {

  public override DOM: HTMLInputElement;

  constructor(text: string, placeHolder: string) {
    super('input');
    this.DOM = document.createElement("input");
    this.DOM.className = 'Input';
    this.DOM.style.padding = '2px';
    this.DOM.style.width = 'calc(100% - 2px)';
    this.DOM.style.borderRadius = '5px';
    this.DOM.style.border = '1px solid transparent';
    this.DOM.style.outline = "none"

    this.DOM.setAttribute('autocomplete', 'off');

    this.DOM.addEventListener('keydown', function (e: KeyboardEvent) {
      e.stopPropagation();
    });

    this.setValue(text);
    this.DOM.setAttribute("placeholder", placeHolder)
  }

  /**
   * @description: 获取本input的值
   */
  getValue() {
    return (this.DOM as HTMLInputElement).value
  }

  /**
   * @description: 设置本input的值
   * @param {string} value 设置值
   */
  setValue(value: string) {
    (this.DOM as HTMLInputElement).value = value;
    return this;
  }

  onChange(closure: (e:Event) => void) {
    (this.DOM as HTMLInputElement).addEventListener('input', (e:Event) => {
      closure(e);
    });
  }
}
