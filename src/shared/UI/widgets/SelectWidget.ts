/*
 * @LastEditors: asahi
 * @Description: 输入框
 * @FilePath: \litegraph\src\shared\UI\widgets\SelectWidget.ts
 * @Date: 2023-07-26 17:28:55
 * @LastEditTime: 2023-09-15 17:17:36
 * @Author: lisushuang
 */

import BaseWidget from "./BaseWidget";
import {ISelectOptionProps, ISelectProp, Option, Select} from "../component/Select";

class SelectWidget extends BaseWidget{

  static widgetType = 'select'

  public override DOM: HTMLElement;

  selectInstance:Select ;

  constructor(option: Partial<ISelectProp>){
    super()
    this.selectInstance = new Select(option);
    this.DOM = this.selectInstance.DOM
  }

  override onChange(closure: (value: any) => void): void {
    this.selectInstance.onChange((value) => {
      closure(value);
    })
  }

  override getValue() {
    return this.selectInstance.value
  }

  override setValue(value: any): void {
    // todo 
    this.selectInstance.setValue(value)
  }

  setOptions(options:Array<ISelectOptionProps>){

    this.selectInstance.dropdown.clear();

    this.selectInstance.options = options;

    options.forEach((item) => {
      const option = new Option(this.selectInstance, item);
      this.selectInstance.dropdown.add(option);
      if (this.selectInstance.hasValue(item.value)) {
        this.selectInstance.activeOptions.push(option);
        option.active();
      }
    })
    
  }
}

export default SelectWidget;
