/*
 * @LastEditors: asahi
 * @Description: 输入框
 * @FilePath: \litegraph\src\shared\UI\widgets\InputWidget.ts
 * @Date: 2023-07-26 17:28:55
 * @LastEditTime: 2023-09-15 17:18:23
 * @Author: lisushuang
 */

import BaseWidget from "./BaseWidget";

export interface IInputProp {
  name:string;
  type: string;
  value: string;
  title: string;
  placeholder: string;
  disabled: boolean;
}

class InputWidget extends BaseWidget{

  static widgetType = 'input'

  public override DOM: HTMLInputElement;

  constructor(option?: Partial<IInputProp>){
    super()

    this.DOM = document.createElement("input")

    this.DOM.type = option?.type ?? 'text';

    if (option?.placeholder) {
      this.DOM.placeholder = option.placeholder;
    }
    if (option?.title) {
      this.DOM.title = option.title;
    }
    if (option?.value) {
      this.DOM.value = option.value;
    }

    this.setStyle({
      // width:"calc(100% - 8px)",
      flex:"1",
      border:"0",
      marginLeft:"4px",
      borderRadius:"5px",
      outline:"none",
      textIndent:"2px",
      fontSize:"14px",
      height:"20px",
      color:"black"
    })

    this.onMousedown((e) => {
      e.stopPropagation();
    })
  }

  override onChange(closure: (value: any) => void): void {
    this.DOM.addEventListener('input',() => {
      closure(this.DOM.value)
    })
  }

  override getValue() {
    return this.DOM.value;
  }

  override setValue(value: any): void {
    this.DOM.value = value;
  }
}

export default InputWidget;
