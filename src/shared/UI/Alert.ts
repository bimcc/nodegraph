/*
 * @LastEditors: lisushuang
 * @Description: Alert 提示
 * @FilePath: /graph/src/shared/UI/Alert.ts
 * @Date: 2023-09-07 17:11:10
 * @LastEditTime: 2023-09-08 09:27:46
 * @Author: lisushuang
 */
import { NativeDiv } from './NativeDiv';

export default class Alert {

  static msgs:Array<NativeDiv> = []

  static error(msg = '') {
    Alert.msg(msg, '#fc5d65', '#ffedee')
  }

  static info(msg = '') {
    Alert.msg(msg, '#919398', '#eef2fb')
  }

  static success(msg = '') {
    Alert.msg(msg, '#7ec050', '#f2f9ec')
  }

  static warning(msg = '') {
    Alert.msg(msg, '#DCA550', '#fcf6ed')
  }

  static msg(msg = '', fontColor = '#000', backColor = '#fff') {
    if (!msg) msg = '提示！'
    let msgBox = new NativeDiv();
    let top = 20 
    Alert.msgs.forEach((item) => {
      top += item.DOM.getBoundingClientRect().height
      top += 10
    })

    msgBox.setBackgroundColor(backColor)
      .setColor(fontColor)
      .addClass("all-center")
      .addClass("alert-msg-global")
      .setPosition("fixed")
      .setTop("0px")
      .setHeight("40px")
      .setWidth("200px", 'min')
      .setBorderRadius("10px")
      .setPaddingLeft("20px")
      .setPaddingRight("20px")
      .innerText(msg)

    msgBox.setStyle({
      lineHeight: "40px",
      opacity: "0",
      zIndex: "2001",
      textAlign:"center",
      transition: "top 0.5s ease-in-out,opacity 0.5s ease-in-out",
      fontWeight:"bold"
    })

    setTimeout(() => {
      msgBox.setLeft(`calc(50% - ${msgBox.DOM.getBoundingClientRect().width / 2}px)`)
    }, 0);

    setTimeout(() => {
      msgBox.setStyle({
        opacity: "1",
        top:top+"px"
      })
    }, 200);

    document.body.appendChild(msgBox.DOM)

    Alert.msgs.push(msgBox)

    setTimeout(() => {
      msgBox.setStyle({
        opacity: "0",
        top:"0px"
      })
    }, 2500);

    setTimeout(() => {
      document.body.removeChild(msgBox.DOM)
    }, 3000);

    setTimeout(() => {
      Alert.msgs = Alert.msgs.filter((value) => {
        value !== msgBox
      })
    },3200)
  }
}