import { getVerticalVector2 } from "../../Utils";
import { SvgBase } from "./Base";
export class NativeSvgPath extends SvgBase {
    constructor() {
        super('path');
    }
    /**
     * @description 绘制填充的贝塞尔2次曲线
     * @param start 起点
     * @param end 终点
     * @param width
     * @param lineColor
     * @param lineStrokeColor
     * @param lineStrokeWidth
     * @param offset 二次贝塞尔曲线基准点偏移值
     * @returns
     */
    drawFillBezierLine(start, end, width, lineColor, lineStrokeColor, lineStrokeWidth, offset) {
        if (isNaN(start.x) || isNaN(start.y) || isNaN(end.x) || isNaN(end.y))
            return;
        //垂直向量
        const ver = getVerticalVector2({ x: end.x - start.x, y: end.y - start.y });
        if (isNaN(ver.x) || isNaN(ver.y))
            return;
        const points = [{
                x: (start.x + (ver.x * width)),
                y: (start.y + (ver.y * width)),
            }, {
                x: (end.x + (ver.x * width)),
                y: (end.y + (ver.y * width)),
            }, {
                x: (end.x + (-ver.x * width)),
                y: (end.y + (-ver.y * width)),
            }, {
                x: (start.x + (-ver.x * width)),
                y: (start.y + (-ver.y * width)),
            }];
        const d = [
            `M ${points[0].x} ${points[0].y} `,
            `C ${points[0].x + offset} ${points[0].y}, ${points[1].x - offset} ${points[1].y}, ${points[1].x} ${points[1].y} `,
            `L ${points[2].x} ${points[2].y} `,
            `C ${points[2].x - offset} ${points[2].y}, ${points[3].x + offset} ${points[3].y}, ${points[3].x} ${points[3].y} `,
            `Z`
        ];
        this.setAttribute('d', d.join(''));
        this.setAttribute('stroke', lineStrokeColor);
        this.setAttribute('stroke-width', `${lineStrokeWidth}`);
        this.setAttribute('fill', lineColor);
    }
}
