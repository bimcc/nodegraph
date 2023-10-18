/*
 * @Author: zw1995
 * @Description:
 * @Date: 2023-07-28 16:08:38
 * @LastEditors: zw1995
 * @LastEditTime: 2023-07-28 16:08:38
 */

import {DomBase} from "../../Base";
import {Select} from "./Select";

export interface ISelectOptionProps {
  // 标签
  label: string;
  // 值
  value: string | number;
}
export class Option extends DomBase {
  public label: string;
  public value: string | number;

  constructor(select: Select, props: ISelectOptionProps) {
    super();
    this.value = props.value;
    this.label = props.label;

    this.addClass('select-option').setPadding('5px 10px').setFontSize(14).setBorderRadius();
    this.setStyle({
      pointerEvents: 'visible'
    })
    this.DOM.innerText = this.label;

    this.onMouseover(() => {
      this.setBackgroundColor('#f3f4f5');
    });

    this.onMouseout(() => {
      this.setBackgroundColor('#fff');
    });

    this.onMousedown((e) => {
      e.stopPropagation()
      select.checked(this);
    });
  }

  active(status = true) {
    if (status) {
      this.setColor('#409EFF');
    } else {
      this.setColor('#303133');
    }
  }
}
