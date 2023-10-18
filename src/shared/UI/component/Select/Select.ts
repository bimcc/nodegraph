/*
 * @Author: zw1995
 * @Description:
 * @Date: 2023-07-28 16:08:38
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-08-25 18:26:57
 */
import { DomBase } from "../../Base";
import {ISelectOptionProps, Option} from "./Option";
import {SelectDropdown} from "./SelectDropdown";
import {NaiveInput} from "../../NativeInput";
import {GraphViewer} from "../../../../viewer";

export interface ISelectProp {
  // 默认值
  value: Array<string | number> | string | number;
  // 选项
  options: Array<ISelectOptionProps>;
  // 多选
  multiple: boolean;
  // 禁用
  disabled: boolean;
  // 事件 - 选项改变时
  onChangeCallback: ((value: Array<string | number> | number | string) => void) | null;
}
export class Select extends DomBase {
  public input: NaiveInput;
  public value: Array<string | number>;
  public options: Array<ISelectOptionProps>;
  public multiple: boolean;
  public disabled: boolean;
  public dropdown: SelectDropdown;
  public activeOptions: Array<Option>;
  public onChangeCallback: ((value: Array<string | number> | number | string) => void) | null;

  constructor(prop: Partial<ISelectProp>) {
    super();

    this.addClass('select').setStyle({
      position: 'relative',
      padding: '0 3px'
    });

    this.multiple = prop?.multiple ?? false;
    this.disabled = prop?.disabled ?? false;
    this.value = prop?.value && !Array.isArray(prop.value) ? [prop.value] : [];
    this.options = prop?.options ?? [];
    this.activeOptions = [];
    this.onChangeCallback = prop?.onChangeCallback ?? null;
    this.input = new NaiveInput('','请选择');
    this.input.DOM.style.cursor = 'pointer';
    this.input.setColor("black")
    this.input.onClick((e: MouseEvent) => {
      e.preventDefault();
      this.dropdown.toggle();
      // @mark selectDropdown中设置了 index = 1即可遮住其他
      // GraphViewer.zIndex = GraphViewer.zIndex + 1
      // this.dropdown.setStyle({
      //   zIndex: GraphViewer.zIndex + ''
      // })
    });
    this.add(this.input);
    // const arr = this.getLabel() as Array<string | number>;
    // this.input.setValue(arr.join());

    // Dropdown
    this.dropdown = new SelectDropdown(`${this.input.DOM.clientHeight + 25}px`);
    // this.dropdown.hide();
    // this.options.forEach((item) => {
    //   const option = new Option(this, item);
    //   this.dropdown.add(option);
    //   if (this.hasValue(item.value)) {
    //     this.activeOptions.push(option);
    //     option.active();
    //   }
    // });
    this.add(this.dropdown);

    this.setValue(this.value);

    // Event
    // this.input.onClick((e: MouseEvent) => {
    //   e.stopPropagation();
    //   this.dropdown.toggle();
    // });

  }

  setValue(value:Array<string|number>):void{
    this.value = value;
    const arr = this.getLabel() as Array<string | number>;
    this.input.setValue(arr.join());
    // Dropdown
    this.dropdown.hide();
    // @mark 重建options的时候要先清空
    this.dropdown.clear();
    this.options.forEach((item) => {
      const option = new Option(this, item);
      this.dropdown.add(option);
      if (this.hasValue(item.value)) {
        this.activeOptions.push(option);
        option.active();
      }
    });
    // onChange
    this.onChangeCallback && this.onChangeCallback(this.value);
  }
  /**
   * @description: 注册数据变化时的回调
   * @param {function} callback
   * @return {*}
   */
  public onChange(callback: (value: Array<string | number> | number | string) => void): this {
    this.onChangeCallback = callback;
    return this;
  }

  /**
   * @description: 新增一个选项
   * @param {Option} option 选项实例
   * @return {this}
   */
  addOption(option: Option): this {
    this.dropdown.add(option);
    return this;
  }

  /**
   * @description: 选中
   * @param {Option} option 选项实例
   * @return {this}
   */
  checked(option: Option): void {
    if (this.multiple) {
      const index = this.activeOptions.indexOf(option);
      if (index > -1) {
        this.activeOptions[index].active(false);
        this.activeOptions.splice(index, 1);

        const valueIndex = this.value.indexOf(option.value);
        this.value.splice(valueIndex, 1);
      } else {
        this.activeOptions.push(option);
        option.active();
        this.value.push(option.value);
      }
    } else {
      if(this.activeOptions.length) {
        this.activeOptions[0].active(false);
      }
      this.activeOptions[0] = option;
      option.active();

      this.value[0] = option.value;
      this.dropdown.toggle();
    }

    const arr = this.getLabel() as Array<string | number>;
    this.input.setValue(arr.join());

    // onChange
    this.onChangeCallback && this.onChangeCallback(this.value);
  }

  /**
   * @description: 获取选中项的显示值
   * @param {string} value
   * @return {*}
   */
  getLabel(value?: string | number): string | Array<string | number> {
    if (value === undefined) {
      const arr: Array<string | number> = [];
      this.options.forEach((item) => {
        this.hasValue(item.value) && arr.push(item.label);
      });
      return arr;
    } else {
      let one = this.options.find((item) => item.value === value);
      return one?.label ?? '';
    }
  }

  /**
   * @description: 获取值
   * @return {*}
   */
  getValue(): Array<string | number> | string | number {
    return this.multiple ? this.value : this.value[0];
  }
  /**
   * @description: 判断某个值是否为已选中
   * @param {string} value
   * @return {*}
   */
  hasValue(value: string | number): boolean {
    return this.value.indexOf(value) > -1;
  }
}
