/*
 * @Author: zw1995
 * @Description: Switch 开关
 * @Date: 2023-07-31 10:08:38
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-08-07 10:19:22
 */

import {DomBase} from "../../Base";
import {NaiveInput} from "../../NativeInput";
import {NativeSpan} from "../../NativeSpan";

export interface ISwitchProp {
  label: string;
  value: boolean | string | number;
  activeText: string;
  inactiveText: string;
  activeValue: boolean | string | number;
  inactiveValue: boolean | string | number;
  activeColor: string;
  inactiveColor: string;
  disabled: boolean;
  onChangeCallback: ((value: boolean | number | string) => void) | null;
}

export class Switch extends DomBase {

  public input: NaiveInput;
  public value: boolean | string | number;
  public activeText: string;
  public inactiveText: string;
  public activeValue: boolean | string | number;
  public inactiveValue: boolean | string | number;
  public activeColor: string;
  public inactiveColor: string;
  public disabled: boolean;

  public activeSpan: NativeSpan;
  public inactiveSpan: NativeSpan;
  public coreSpan: NativeSpan;
  public switchSpan: NativeSpan;

  public onChangeCallback: ((value: boolean | number | string) => void) | null;

  constructor(prop: Partial<ISwitchProp>) {
    super();
    this.addClass('switch').setStyle({
      whiteSpace: 'nowrap',
      textAlign: 'right'
    });
    this.value = prop?.value ?? false;
    this.activeText = prop?.activeText ?? '';
    this.inactiveText = prop?.inactiveText ?? '';
    this.activeValue = prop?.activeValue ?? true;
    this.inactiveValue = prop?.inactiveValue ?? false;
    this.activeColor = prop?.activeColor ?? '#409EFF';
    this.inactiveColor = prop?.inactiveColor ?? '#C0CCDA';
    this.disabled = prop?.disabled ?? false;
    this.input = new NaiveInput('','请选择');
    this.input.DOM.setAttribute('type', 'hidden');
    this.inactiveSpan = new NativeSpan();
    this.activeSpan = new NativeSpan();
    this.coreSpan = new NativeSpan();
    this.switchSpan = new NativeSpan();
    this.onChangeCallback = prop?.onChangeCallback ?? null;

    this.add(this.input)
    this.initSwitchDom()
  }

  initSwitchDom () {
    if(this.inactiveText) {
      this.inactiveSpan.innerText(this.inactiveText)
      this.inactiveSpan.setStyle({
        marginRight: '10px',
        height: '20px',
        display: 'inline-block',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        verticalAlign: 'middle',
        color: this.inactiveColor,
        lineHeight: '20px'
      })
      this.add(this.inactiveSpan)
    }
    this.coreSpan.setStyle({
      position: 'absolute',
      top: '2px',
      display: 'block',
      borderRadius: '100%',
      width: '16px',
      height: '16px',
      backgroundColor: '#FFFFFF'
    })
    let bgColor = this.value ? this.activeColor : this.inactiveColor
    this.switchSpan.setStyle({
      position: 'relative',
      width: '40px',
      backgroundColor: bgColor,
      display: 'inline-block',
      height: '20px',
      borderRadius: '10px',
      boxSizing: 'border-box',
      cursor: 'pointer',
      transition: 'border-color .3s,background-color .3s',
      verticalAlign: 'middle',
    })
    this.switchSpan.add(this.coreSpan)
    if(this.value) {
      this.coreSpan.setRight(3)
    } else {
      this.coreSpan.setLeft(3)
    }
    this.add(this.switchSpan)

    this.switchSpan.onMousedown((e)=>{
      e.stopPropagation()
      this.value = !this.value
      if(this.value) {
        this.coreSpan.setLeft('')
        this.coreSpan.setRight(3)
        this.switchSpan.setBackgroundColor(this.activeColor)
        this.activeSpan.setColor(this.activeColor)
        this.inactiveSpan.setColor(this.inactiveColor)
      } else {
        this.coreSpan.setLeft(3)
        this.coreSpan.setRight('')
        this.switchSpan.setBackgroundColor(this.inactiveColor)
        this.activeSpan.setColor(this.inactiveColor)
        this.inactiveSpan.setColor(this.activeColor)
      }
      // onChange
      this.onChangeCallback && this.onChangeCallback(this.value);
    })

    if(this.activeText) {
      this.activeSpan.innerText(this.activeText)
      this.activeSpan.setStyle({
        marginLeft: '10px',
        height: '20px',
        display: 'inline-block',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        verticalAlign: 'middle',
        color: this.activeColor,
        lineHeight: '20px'
      })
      this.add(this.activeSpan)
    }
  }

  onChange(callback: (value: boolean | number | string) => void) {
    this.onChangeCallback = callback;
    return this;
  }

  setValue(value:boolean | string | number){
    if(value === this.value) return 
    this.value = value
    if (this.value) {
      this.coreSpan.setLeft('')
      this.coreSpan.setRight(3)
      this.switchSpan.setBackgroundColor(this.activeColor)
      this.activeSpan.setColor(this.activeColor)
      this.inactiveSpan.setColor(this.inactiveColor)
    } else {
      this.coreSpan.setLeft(3)
      this.coreSpan.setRight('')
      this.switchSpan.setBackgroundColor(this.inactiveColor)
      this.activeSpan.setColor(this.inactiveColor)
      this.inactiveSpan.setColor(this.activeColor)
    }
  }
}
