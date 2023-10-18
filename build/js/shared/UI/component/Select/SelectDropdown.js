/*
 * @Author: zw1995
 * @Description:
 * @Date: 2023-07-28 16:08:38
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-08-10 11:36:41
 */
import { DomBase } from "../../Base";
export class SelectDropdown extends DomBase {
    constructor(top) {
        super();
        this.addClass('select-dropdown')
            .setStyle({
            position: 'absolute',
            left: '2px',
            top: top,
            border: '1px solid #ccc',
            width: '100%',
            minHeight: '30px',
            maxHeight: "300px",
            boxSizing: 'border-box',
            cursor: 'pointer',
            color: '#656464',
            overflowY: "auto",
            zIndex: "1"
        })
            .setBorderRadius()
            .setBoxShadow('#ccc 0px 0px 5px 1px')
            .setBackgroundColor('#fff');
        this.onWheel((e) => {
            e.stopPropagation();
        });
    }
}
