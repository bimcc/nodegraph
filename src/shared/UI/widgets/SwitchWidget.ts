/*
 * @LastEditors: lisushuang
 * @Description: Switch 开关
 * @FilePath: /graph/src/shared/UI/widgets/SwitchWidget.ts
 * @Date: 2023-07-31 10:28:55
 * @LastEditTime: 2023-08-25 17:50:21
 * @Author: zw1995
 */

import BaseWidget from "./BaseWidget";
import {ISwitchProp, Switch} from "../component/Switch";
import {NativeDiv} from "../NativeDiv";

class SwitchWidget extends BaseWidget{

  static widgetType = 'switch'

  public override DOM: HTMLElement;

  switchInstance: Switch;

  constructor(option: Partial<ISwitchProp>){
    super()
    this.switchInstance = new Switch(option);
    let formItem = new NativeDiv()
    formItem.setStyle({
      display: 'flex',
      justifyContent: 'space-between'
    })
    if(option?.label) {
      let label = new NativeDiv()
      let labelText = option?.label;
      label.innerText(labelText)
      label.setStyle({
        fontSize: '14px',
        lineHeight: '25px',
        whiteSpace: 'nowrap',
        textIndent: '5px',
        marginRight: '10px'
      })
      formItem.add(label)
    }

    formItem.add( this.switchInstance)
    this.DOM = formItem.DOM
    this.DOM.addEventListener("dblclick", (e) => {
      e.stopPropagation()
    })
  }

  override onChange(closure: (value: any) => void): void {
    this.switchInstance.onChange((value) => {
      closure(value);
    })
  }

  override setValue(value: any): void {
    this.switchInstance.setValue(value)
  }

  override getValue() {
    return this.switchInstance.value;
  }
}

export default SwitchWidget;
