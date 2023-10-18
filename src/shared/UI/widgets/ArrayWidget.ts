import BaseWidget from "./BaseWidget";
import {NativeDiv} from "../NativeDiv";
import {NativeButton} from "../NativeButton";
import {NaiveInput} from "../NativeInput";
import {IFunction} from "../../../interfaces";

export interface IArrayProp {
  value?: Array<string | number> | string;
}

/**
 * @description 输入数组类型,其结果值(,)分割
 */
class ArrayWidget extends BaseWidget {

  static widgetType: string = 'array';

  public override DOM: HTMLElement;

  private inputDIVs: NativeDiv;

  closure: IFunction = (value: any) => {
  };

  constructor(option?: Partial<IArrayProp>) {
    super()

    this.inputDIVs = new NativeDiv();
    this.inputDIVs.setFlex()
    this.inputDIVs.setFlexDirection('column')

    if (option?.value) {
      let valueArr: Array<string | number> = [];
      if (typeof option.value === 'string') {
        valueArr = option.value.split(',');
      } else if (typeof option.value === 'object') {
        valueArr = option.value
      }
      valueArr.forEach((value) => {
        this.addInputDIV(String(value))
      })
    } else {
      this.addInputDIV()
    }

    let ButtonDIV = new NativeDiv();
    ButtonDIV.add(this.addButton());


    let topDIV = new NativeDiv();
    topDIV.add(this.inputDIVs).add(ButtonDIV);

    this.DOM = topDIV.DOM
    this.DOM.addEventListener("dblclick", (e) => {
      e.stopPropagation()
    })
  }

  addInputDIV(value: string = ''): void {
    let inputDIV = new NativeDiv();
    inputDIV.setStyle({minWidth: '170px'})
    let input = new NaiveInput('', '请输入');
    input.setColor('black');
    input.DOM.addEventListener('input', () => {
      this.closure(this.getValue())
    })
    input.setStyle({width: '140px', marginBottom: '2px', marginRight: '2px'})
    input.setValue(value);

    inputDIV.add(input).add(this.delButton(inputDIV.DOM))

    this.inputDIVs.add(inputDIV);
  }

  private addButton() {
    // 添加input
    let add = new NativeButton('+');
    add.setStyle({width: '20px', height: '20px'})
    add.DOM.addEventListener('click', () => {
      this.addInputDIV()
    });
    return add;
  }

  private delButton(delDOM: HTMLElement) {
    // 删除input
    let del = new NativeButton('-');
    del.setStyle({width: '20px', height: '20px',minWidth:'20px'})
    del.DOM.addEventListener('click', () => {
      delDOM.remove();
      this.closure(this.getValue())
    });
    return del;
  }

  override onChange(closure: (value: any) => void): void {
    this.closure = closure
    this.inputDIVs.DOM.childNodes.forEach((inputDIV) => {
      (inputDIV.firstChild as HTMLInputElement).addEventListener('input', () => {
        this.closure(this.getValue())
      });
      (inputDIV.lastChild as HTMLElement).addEventListener('click', () => {
        this.closure(this.getValue())
      });
    })
  }

  override getValue() {
    let values: Array<string | number> = []
    this.inputDIVs.DOM.childNodes.forEach((inputDIV) => {
      values.push((inputDIV.firstChild as HTMLInputElement).value)
    })
    return values.join(',')
  }

  override setValue(value: any): void {
    this.inputDIVs.DOM.childNodes.forEach((inputDIV) => {
      this.inputDIVs.DOM.removeChild(inputDIV)
    })

    let valueArr: Array<string | number> = [];
    if (typeof value === 'string') {
      valueArr = value.split(',');
    } else if (typeof value === 'object') {
      valueArr = value
    }

    valueArr.forEach((value) => {
      this.addInputDIV(String(value))
    })
  }
}

export default ArrayWidget;
